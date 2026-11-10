#!/usr/bin/env node
// scripts/optimize-images.mjs
// ============================================================
// Script tối ưu hóa ảnh: PNG/JPG → WebP + resize
// Chạy: node scripts/optimize-images.mjs
// ============================================================

import sharp from 'sharp'
import { readdir, mkdir, stat, rename } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC_IMAGES = join(ROOT, 'public', 'images')
const BACKUP_DIR = join(ROOT, 'public', 'images', '_originals_backup')

// ============================================================
// CẤU HÌNH CHẤT LƯỢNG & KÍCH THƯỚC THEO TỪNG THƯ MỤC
// ============================================================
const PROFILES = {
  // Ảnh thumbnail game — hiển thị dưới dạng icon app ~140x140px trên card
  games: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 82,
    effort: 6,          // sharp WebP effort: 1 (nhanh) → 6 (nén tốt nhất)
    skipIfUnder: 150,   // Bỏ qua nếu ảnh gốc < 150KB
  },
  // Mascot — dùng cho animation, cần transparent, kích thước to hơn
  mascot: {
    maxWidth: 600,
    maxHeight: 600,
    quality: 80,
    effort: 5,
    skipIfUnder: 50,
  },
  // Ảnh profile avatar
  profile: {
    maxWidth: 300,
    maxHeight: 300,
    quality: 85,
    effort: 4,
    skipIfUnder: 0,     // Luôn convert dù nhỏ
  },
  // Ảnh memory game (nhỏ, không cần resize nhiều)
  memory: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 80,
    effort: 4,
    skipIfUnder: 0,
  },
  // Mặc định cho các thư mục khác
  default: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 82,
    effort: 5,
    skipIfUnder: 100,
  }
}

// Ảnh cần SKIP (không convert): banner, background dùng toàn trang
const SKIP_FILES = new Set([
  'banner.jpg',
  'background.jpg',
  'bk.jpg',
  'bk1.jpg',
  'sky.png',  // Rất nhỏ, không đáng
  '3d-bubble-cloud-3d-cartoon-icon-vector.jpg',
])

let totalSavedKB = 0
let convertedCount = 0
let skippedCount = 0

// ============================================================
// HÀM CHÍNH: Convert 1 ảnh
// ============================================================
async function convertToWebP(inputPath, profile) {
  const ext = extname(inputPath).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return
  
  const fileName = basename(inputPath)
  if (SKIP_FILES.has(fileName)) {
    console.log(`  ⏭  Bỏ qua (whitelist): ${fileName}`)
    skippedCount++
    return
  }

  const fileStat = await stat(inputPath)
  const fileSizeKB = Math.round(fileStat.size / 1024)

  if (fileSizeKB < profile.skipIfUnder) {
    console.log(`  ⏭  Bỏ qua (${fileSizeKB}KB < ${profile.skipIfUnder}KB): ${fileName}`)
    skippedCount++
    return
  }

  const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  
  // Kiểm tra nếu webp đã tồn tại (đã convert lần trước)
  try {
    await stat(outputPath)
    console.log(`  ✅ Đã có sẵn webp, bỏ qua: ${basename(outputPath)}`)
    skippedCount++
    return
  } catch { /* webp chưa tồn tại, tiếp tục */ }

  try {
    const img = sharp(inputPath)
    const meta = await img.metadata()
    
    // Chỉ resize nếu ảnh lớn hơn maxWidth/maxHeight
    const needsResize = (meta.width ?? 0) > profile.maxWidth || (meta.height ?? 0) > profile.maxHeight

    const pipeline = needsResize
      ? img.resize(profile.maxWidth, profile.maxHeight, {
          fit: 'inside',         // Giữ tỷ lệ, không crop
          withoutEnlargement: true,
        })
      : img

    await pipeline.webp({
      quality: profile.quality,
      effort: profile.effort,
      lossless: false,
    }).toFile(outputPath)

    const newStat = await stat(outputPath)
    const newSizeKB = Math.round(newStat.size / 1024)
    const savedKB = fileSizeKB - newSizeKB
    const savePct = Math.round((savedKB / fileSizeKB) * 100)

    totalSavedKB += Math.max(0, savedKB)
    convertedCount++

    const sizeTag = needsResize ? `${meta.width}×${meta.height} → ${profile.maxWidth}×${profile.maxHeight}` : `${meta.width}×${meta.height} (không resize)`
    console.log(`  ✅ ${fileName} → ${basename(outputPath)}`)
    console.log(`     ${fileSizeKB}KB → ${newSizeKB}KB | tiết kiệm ${savedKB}KB (${savePct}%) | ${sizeTag}`)

  } catch (err) {
    console.error(`  ❌ Lỗi convert ${fileName}:`, err.message)
  }
}

// ============================================================
// Quét thư mục đệ quy
// ============================================================
async function processDirectory(dirPath, profile) {
  let entries
  try {
    entries = await readdir(dirPath, { withFileTypes: true })
  } catch {
    return
  }
  
  for (const entry of entries) {
    if (entry.name.startsWith('_')) continue  // Bỏ qua _originals_backup
    const fullPath = join(dirPath, entry.name)
    if (entry.isDirectory()) {
      await processDirectory(fullPath, profile)
    } else {
      await convertToWebP(fullPath, profile)
    }
  }
}

// ============================================================
// ENTRY POINT
// ============================================================
async function main() {
  console.log('🖼  Bắt đầu tối ưu hóa ảnh...')
  console.log(`📁 Thư mục gốc: ${PUBLIC_IMAGES}\n`)

  // Tạo backup dir
  await mkdir(BACKUP_DIR, { recursive: true })

  // Xử lý từng nhóm ảnh với profile phù hợp
  const groups = [
    { path: join(PUBLIC_IMAGES, 'games'),   profile: PROFILES.games   },
    { path: join(PUBLIC_IMAGES, 'mascot'),  profile: PROFILES.mascot  },
    { path: join(PUBLIC_IMAGES, 'profile'), profile: PROFILES.profile },
    { path: join(PUBLIC_IMAGES, 'memory'),  profile: PROFILES.memory  },
    { path: join(PUBLIC_IMAGES, 'lo-to'),   profile: PROFILES.games   },
    { path: join(PUBLIC_IMAGES, 'chiec-non-ky-dieu'), profile: PROFILES.games },
  ]

  for (const { path: dirPath, profile } of groups) {
    const groupName = basename(dirPath)
    console.log(`\n📂 Xử lý thư mục: ${groupName}/`)
    console.log(`   (max: ${profile.maxWidth}×${profile.maxHeight}px, quality: ${profile.quality}%, bỏ qua nếu < ${profile.skipIfUnder}KB)`)
    await processDirectory(dirPath, profile)
  }

  // Ảnh root level
  console.log(`\n📂 Xử lý ảnh root (banner, mau.png...):`)
  const rootEntries = await readdir(PUBLIC_IMAGES, { withFileTypes: true })
  for (const entry of rootEntries) {
    if (!entry.isDirectory()) {
      await convertToWebP(join(PUBLIC_IMAGES, entry.name), PROFILES.default)
    }
  }

  // Tổng kết
  console.log('\n' + '='.repeat(60))
  console.log('✅ HOÀN THÀNH!')
  console.log(`   Đã convert: ${convertedCount} ảnh`)
  console.log(`   Bỏ qua:     ${skippedCount} ảnh`)
  console.log(`   Tiết kiệm:  ~${Math.round(totalSavedKB / 1024 * 10) / 10} MB`)
  console.log('='.repeat(60))
  
  console.log('\n📋 BƯỚC TIẾP THEO:')
  console.log('   1. Kiểm tra thư mục public/images/ để xem file .webp mới')
  console.log('   2. Chạy script update-image-refs.mjs để cập nhật đường dẫn trong code')
  console.log('   3. Nếu OK: xóa các file .png gốc nặng (giữ lại backup nếu cần)')
}

main().catch(console.error)

