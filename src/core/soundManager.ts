// src/core/soundManager.ts
// Namespace-based audio manager – zero external deps, lazy init, Mixed Content safe

type SoundNamespace = string
type SoundKey = string
type FullKey = `${SoundNamespace}:${SoundKey}`

interface SoundEntry {
  path: string
  loop: boolean
  audio: HTMLAudioElement | null
}

class SoundManager {
  private registry = new Map<FullKey, SoundEntry>()
  private muted = false

  private fullKey(ns: SoundNamespace, key: SoundKey): FullKey {
    return `${ns}:${key}` as FullKey
  }

  /** Đăng ký âm thanh – gọi trước khi play */
  register(namespace: SoundNamespace, key: SoundKey, path: string, loop = false): void {
    this.registry.set(this.fullKey(namespace, key), { path, loop, audio: null })
  }

  /** Lazy create + play – phải gọi sau user gesture (click) để tránh bị block */
  play(namespace: SoundNamespace, key: SoundKey): void {
    if (this.muted) return
    const fk = this.fullKey(namespace, key)
    const entry = this.registry.get(fk)
    if (!entry) return

    if (!entry.audio) {
      entry.audio = new Audio(entry.path)
      entry.audio.loop = entry.loop
      entry.audio.preload = 'auto'
    }

    entry.audio.currentTime = 0
    entry.audio.play().catch(() => { /* autoplay policy – silent fail */ })
  }

  /** Dừng một âm thanh */
  stop(namespace: SoundNamespace, key: SoundKey): void {
    const entry = this.registry.get(this.fullKey(namespace, key))
    if (!entry?.audio) return
    entry.audio.pause()
    entry.audio.currentTime = 0
  }

  /** Dừng tất cả âm trong 1 namespace */
  stopAll(namespace: SoundNamespace): void {
    for (const [fk, entry] of this.registry) {
      if (fk.startsWith(`${namespace}:`) && entry.audio) {
        entry.audio.pause()
        entry.audio.currentTime = 0
      }
    }
  }

  setMuted(muted: boolean): void { this.muted = muted }
  isMuted(): boolean { return this.muted }
}

export const soundManager = new SoundManager()

// ── Đăng ký âm thanh Rung Chuông Vàng (local, tránh Mixed Content) ──
soundManager.register('rcv', 'tick', '/sounds/rcv/tick.mp3', true)
soundManager.register('rcv', 'out',  '/sounds/rcv/out.mp3')
soundManager.register('rcv', 'in',   '/sounds/rcv/in.mp3')
soundManager.register('rcv', 'end',  '/sounds/rcv/end.mp3')
