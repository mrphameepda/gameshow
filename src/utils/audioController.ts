// src/utils/audioController.ts
// Web Audio API – zero external deps, tree-shakeable

type SoundName = 'bell' | 'correct' | 'wrong' | 'countdown' | 'fanfare' | 'tick'

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext()
  return audioCtx
}

/** Tổng hợp âm thanh chuông từ Web Audio API */
function synthesizeBell(ctx: AudioContext, freq = 880, duration = 1.2) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.8, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

function synthesizeBeep(ctx: AudioContext, freq: number, duration: number, type: OscillatorType = 'sine') {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.5, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

/** Phát âm thanh theo tên */
export function playSound(name: SoundName): void {
  try {
    const ctx = getCtx()
    // Resume nếu bị suspended (policy trình duyệt)
    if (ctx.state === 'suspended') ctx.resume()

    switch (name) {
      case 'bell':
        synthesizeBell(ctx, 880, 1.5)
        setTimeout(() => synthesizeBell(ctx, 1108, 1.2), 150)
        break
      case 'correct':
        synthesizeBeep(ctx, 523, 0.15)
        setTimeout(() => synthesizeBeep(ctx, 659, 0.15), 160)
        setTimeout(() => synthesizeBeep(ctx, 784, 0.3), 320)
        break
      case 'wrong':
        synthesizeBeep(ctx, 220, 0.4, 'sawtooth')
        break
      case 'countdown':
        synthesizeBeep(ctx, 440, 0.08, 'square')
        break
      case 'fanfare':
        ;[523, 659, 784, 1047].forEach((f, i) =>
          setTimeout(() => synthesizeBeep(ctx, f, 0.25), i * 180)
        )
        break
      case 'tick':
        synthesizeBeep(ctx, 800, 0.05, 'square')
        break
    }
  } catch {
    // Bỏ qua lỗi audio – không làm crash UI
  }
}

export function resumeAudioContext(): void {
  if (audioCtx?.state === 'suspended') audioCtx.resume()
}
