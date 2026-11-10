#!/usr/bin/env node
// scripts/update-image-refs.mjs
// ============================================================
// Script cập nhật đường dẫn ảnh trong source code:
// Thay thế .png / .jpg → .webp (chỉ cho những file đã convert)
// Chạy SAU khi đã chạy optimize-images.mjs
// ============================================================

import { readFile, writeFile, stat } from 'fs/promises'
import { readdir } from 'fs/promises'
import { join, extname, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'src')
const PUBLIC_IMAGES = join(ROOT, 'public', 'images')

// Kiểm tra xem file .webp tương ứng có tồn tại không
async function webpExists(originalPath) {
  const webpPath = originalPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  try {
    await stat(webpPath)
    return true
  } catch {
    return false
  }
}

// Danh sách các image path được reference trong code → cần cập nhật
// (chỉ cập nhật nếu webp đã tồn tại)
const IMAGE_PATTERNS = [
  // games thumbnails  
  { old: '/images/games/chiec-non-ky-dieu.png', check: join(PUBLIC_IMAGES, 'games', 'chiec-non-ky-dieu.webp') },
  { old: '/images/games/rung-chuong-vang.png',  check: join(PUBLIC_IMAGES, 'games', 'rung-chuong-vang.webp') },
  { old: '/images/games/lo-to.png',             check: join(PUBLIC_IMAGES, 'games', 'lo-to.webp') },
  { old: '/images/games/lat-hinh.png',          check: join(PUBLIC_IMAGES, 'games', 'lat-hinh.webp') },
  { old: '/images/games/do-vui-giao-ly.png',    check: join(PUBLIC_IMAGES, 'games', 'do-vui-giao-ly.webp') },
  { old: '/images/games/ai-la-trieu-phu.png',   check: join(PUBLIC_IMAGES, 'games', 'ai-la-trieu-phu.webp') },
  { old: '/images/games/tao-quiz.png',          check: join(PUBLIC_IMAGES, 'games', 'tao-quiz.webp') },
  { old: '/images/games/xo-so.png',             check: join(PUBLIC_IMAGES, 'games', 'xo-so.webp') },
  { old: '/images/games/sap-xep-kinh-thanh.png',check: join(PUBLIC_IMAGES, 'games', 'sap-xep-kinh-thanh.webp') },
  { old: '/images/games/tim-tu.png',            check: join(PUBLIC_IMAGES, 'games', 'tim-tu.webp') },
  { old: '/images/games/rung-chuong-vanga.png', check: join(PUBLIC_IMAGES, 'games', 'rung-chuong-vanga.webp') },
  { old: '/images/games/do-vui-giao-lys.png',   check: join(PUBLIC_IMAGES, 'games', 'do-vui-giao-lys.webp') },
  { old: '/images/games/tao-quizs.png',         check: join(PUBLIC_IMAGES, 'games', 'tao-quizs.webp') },
  { old: '/images/games/lat-hinh2.png',         check: join(PUBLIC_IMAGES, 'games', 'lat-hinh2.webp') },
  { old: '/images/games/xo-soj.png',            check: join(PUBLIC_IMAGES, 'games', 'xo-soj.webp') },
  // mascot
  { old: '/images/mascot/jesus-waving-sheet.png', check: join(PUBLIC_IMAGES, 'mascot', 'jesus-waving-sheet.webp') },
  { old: '/images/mascot/sheep.png',              check: join(PUBLIC_IMAGES, 'mascot', 'sheep.webp') },
  { old: '/images/mascot/girl-right-to-left.png', check: join(PUBLIC_IMAGES, 'mascot', 'girl-right-to-left.webp') },
  { old: '/images/mascot/cloud_1.png',            check: join(PUBLIC_IMAGES, 'mascot', 'cloud_1.webp') },
  { old: '/images/mascot/boy-run-jump.png',        check: join(PUBLIC_IMAGES, 'mascot', 'boy-run-jump.webp') },
  { old: '/images/mascot/cloud_2.png',            check: join(PUBLIC_IMAGES, 'mascot', 'cloud_2.webp') },
  { old: '/images/mascot/cloud_sun.png',           check: join(PUBLIC_IMAGES, 'mascot', 'cloud_sun.webp') },
  // thumbnails
  { old: '/images/lo-to/thumbnail.png',           check: join(PUBLIC_IMAGES, 'lo-to', 'thumbnail.webp') },
  { old: '/images/chiec-non-ky-dieu/thumbnail.png', check: join(PUBLIC_IMAGES, 'chiec-non-ky-dieu', 'thumbnail.webp') },
  // profile avatars
  { old: '/images/profile/glv1.png',   check: join(PUBLIC_IMAGES, 'profile', 'glv1.webp') },
  { old: '/images/profile/glv2.png',   check: join(PUBLIC_IMAGES, 'profile', 'glv2.webp') },
  { old: '/images/profile/glv3.png',   check: join(PUBLIC_IMAGES, 'profile', 'glv3.webp') },
  { old: '/images/profile/vaodoi1.png',check: join(PUBLIC_IMAGES, 'profile', 'vaodoi1.webp') },
  { old: '/images/profile/vaodoi2.png',check: join(PUBLIC_IMAGES, 'profile', 'vaodoi2.webp') },
  { old: '/images/profile/khaitam1.png',check: join(PUBLIC_IMAGES, 'profile', 'khaitam1.webp') },
  { old: '/images/profile/khaitam2.png',check: join(PUBLIC_IMAGES, 'profile', 'khaitam2.webp') },
  { old: '/images/profile/baodong1.png',check: join(PUBLIC_IMAGES, 'profile', 'baodong1.webp') },
  { old: '/images/profile/themuc1.png', check: join(PUBLIC_IMAGES, 'profile', 'themuc1.webp') },
  { old: '/images/profile/themuc2.png', check: join(PUBLIC_IMAGES, 'profile', 'themuc2.webp') },
  // mau.png
  { old: '/images/mau.png', check: join(PUBLIC_IMAGES, 'mau.webp') },
]

async function collectSourceFiles(dir) {
  const files = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name === 'node_modules') continue
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(fullPath)))
    } else if (['.tsx', '.ts', '.css', '.html'].includes(extname(entry.name))) {
      files.push(fullPath)
    }
  }
  return files
}

async function main() {
  console.log('🔄 Bắt đầu cập nhật đường dẫn ảnh trong source code...\n')

  // Lọc ra những pattern có file webp thực sự tồn tại
  const activePatterns = []
  for (const pattern of IMAGE_PATTERNS) {
    try {
      await stat(pattern.check)
      activePatterns.push(pattern)
    } catch {
      console.log(`  ⏭  Chưa có WebP: ${pattern.old} (bỏ qua)`)
    }
  }

  if (activePatterns.length === 0) {
    console.log('\n⚠️  Chưa có file WebP nào được tìm thấy.')
    console.log('   Hãy chạy: node scripts/optimize-images.mjs trước!')
    return
  }

  console.log(`\n✅ Tìm thấy ${activePatterns.length} file WebP sẵn sàng cập nhật reference.\n`)

  // Thu thập tất cả file source
  const srcFiles = await collectSourceFiles(SRC_DIR)
  console.log(`📁 Quét ${srcFiles.length} file source...\n`)

  let totalFilesModified = 0
  let totalReplacements = 0

  for (const filePath of srcFiles) {
    let content = await readFile(filePath, 'utf-8')
    let modified = false
    let fileReplacements = 0

    for (const pattern of activePatterns) {
      const newPath = pattern.old.replace(/\.(png|jpg|jpeg)$/i, '.webp')
      if (content.includes(pattern.old)) {
        content = content.replaceAll(pattern.old, newPath)
        fileReplacements++
        modified = true
      }
    }

    if (modified) {
      await writeFile(filePath, content, 'utf-8')
      const relPath = filePath.replace(ROOT, '').replace(/\\/g, '/')
      console.log(`  ✅ ${relPath} (${fileReplacements} thay thế)`)
      totalFilesModified++
      totalReplacements += fileReplacements
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ HOÀN THÀNH!')
  console.log(`   Files đã cập nhật: ${totalFilesModified}`)
  console.log(`   Tổng thay thế:     ${totalReplacements}`)
  console.log('='.repeat(60))
  
  console.log('\n📋 BƯỚC TIẾP THEO:')
  console.log('   1. Chạy npm run dev để kiểm tra UI')
  console.log('   2. Nếu ảnh hiển thị đúng: có thể xóa các file .png gốc nặng')
  console.log('   3. Chạy npm run build để verify build production')
}

main().catch(console.error)

