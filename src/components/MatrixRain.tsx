'use client'

import { useEffect, useRef, type PointerEvent } from 'react'

const glyphs = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ012345789'

type Stream = {
  x: number
  y: number
  speed: number
  length: number
  opacity: number
  seed: number
}

export default function MatrixRain({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const reseed = useRef<(() => void) | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    let width = 0
    let height = 0
    let cell = 22
    let glyphStep = 12
    let glyphSize = 11
    let streams: Stream[] = []
    let frame = 0
    let previous = 0
    let tick = 0
    let pulse = 0

    const makeStreams = () => {
      const count = Math.ceil(width / cell)
      streams = Array.from({ length: count }, (_, column) => ({
        x: (column + .5) * cell,
        y: Math.random() * (height + 450) - 340,
        speed: 55 + Math.random() * 125,
        length: 10 + Math.floor(Math.random() * 21),
        opacity: Math.random() > .2 ? .55 + Math.random() * .4 : .25 + Math.random() * .18,
        seed: Math.floor(Math.random() * glyphs.length),
      })).filter(() => Math.random() > .08)
    }

    const draw = (delta = 0) => {
      context.clearRect(0, 0, width, height)
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.font = `600 ${glyphSize}px ui-monospace, SFMono-Regular, Consolas, monospace`

      for (const stream of streams) {
        if (!reducedMotion) {
          stream.y += stream.speed * delta
          if (stream.y - stream.length * glyphStep > height + 25) {
            stream.y = -Math.random() * 320
            stream.speed = 55 + Math.random() * 125
            stream.length = 10 + Math.floor(Math.random() * 21)
            stream.seed = Math.floor(Math.random() * glyphs.length)
          }
        }
        for (let index = stream.length - 1; index >= 0; index--) {
          const y = stream.y - index * glyphStep
          if (y < -glyphStep || y > height + glyphStep) continue
          const dx = pointer.current ? stream.x - pointer.current.x : 999
          const dy = pointer.current ? y - pointer.current.y : 999
          const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / 130)
          const strength = Math.pow(1 - index / stream.length, 1.4)
          const alpha = Math.min(1, stream.opacity * (.25 + .75 * strength) + proximity * .58)
          const character = glyphs[(stream.seed + index * 7 + Math.floor(tick / 6)) % glyphs.length]
          context.shadowBlur = index === 0 || proximity > .3 ? 11 : 2
          context.shadowColor = '#ff284f'
          context.fillStyle = index === 0
            ? `rgba(255,235,239,${Math.max(.55, alpha)})`
            : `rgba(255,42,78,${alpha})`
          context.fillText(character, stream.x, y)
        }
      }

      if (pulse > 0 && pointer.current && !reducedMotion) {
        context.beginPath()
        context.arc(pointer.current.x, pointer.current.y, (1 - pulse) * 150, 0, Math.PI * 2)
        context.lineWidth = 1.5
        context.strokeStyle = `rgba(255,96,120,${pulse * .48})`
        context.shadowBlur = 20
        context.shadowColor = '#ff3158'
        context.stroke()
        pulse = Math.max(0, pulse - delta * 1.6)
      }
      context.shadowBlur = 0
    }

    const measure = () => {
      const bounds = canvas.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      cell = width < 500 ? 15 : 22
      glyphStep = width < 500 ? 10 : 12
      glyphSize = width < 500 ? 9 : 11
      makeStreams()
      draw()
    }

    reseed.current = () => { makeStreams(); pulse = 1; draw() }
    const observer = new ResizeObserver(measure)
    observer.observe(canvas)
    measure()

    const animate = (now: number) => {
      frame = requestAnimationFrame(animate)
      if (document.hidden || now - previous < 33) return
      const delta = previous ? Math.min((now - previous) / 1000, .08) : 0
      previous = now
      tick++
      draw(delta)
    }
    if (!reducedMotion) frame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      reseed.current = null
    }
  }, [reducedMotion])

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointer.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }

  return (
    <button className="matrix-field" type="button" aria-label="Reshuffle the red code rain" onPointerMove={move} onPointerLeave={() => { pointer.current = null }} onClick={() => reseed.current?.()}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="matrix-word" aria-hidden="true">JISHNU</span>
      <span className="matrix-hint" aria-hidden="true">MOVE / TAP TO REMIX</span>
    </button>
  )
}
