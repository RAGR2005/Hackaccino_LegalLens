"use client"

import { useEffect, useRef, useState } from "react"

interface Shape {
  type: string;
  draw: (x: number, y: number, size: number, color: string, rotation: number) => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  baseSize: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  shape: Shape;
  opacity: number;
  pulse: {
    active: boolean;
    speed: number;
    min: number;
    max: number;
    direction: number;
  };
  colorShift: {
    active: boolean;
    hue: number;
    speed: number;
  };
}

// Helper functions with proper type annotations
function drawScale(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, rotation: number) {
  const s = size / 2

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.strokeStyle = color
  ctx.lineWidth = 3

  ctx.beginPath()
  // Base
  ctx.moveTo(-s * 0.8, s * 0.8)
  ctx.lineTo(s * 0.8, s * 0.8)
  // Stem
  ctx.moveTo(0, s * 0.8)
  ctx.lineTo(0, -s * 0.5)
  // Crossbar
  ctx.moveTo(-s * 0.7, -s * 0.5)
  ctx.lineTo(s * 0.7, -s * 0.5)
  // Left dish
  ctx.moveTo(-s * 0.7, -s * 0.5)
  ctx.bezierCurveTo(-s * 0.7, -s * 0.3, -s * 0.3, -s * 0.1, -s * 0.7, 0)
  // Right dish
  ctx.moveTo(s * 0.7, -s * 0.5)
  ctx.bezierCurveTo(s * 0.7, -s * 0.3, s * 0.3, -s * 0.1, s * 0.7, 0)

  ctx.stroke()
  ctx.restore()
}

function drawBook(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, rotation: number) {
  const s = size / 2

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.strokeStyle = color
  ctx.lineWidth = 3

  ctx.beginPath()
  // Cover
  ctx.rect(-s * 0.7, -s * 0.5, s * 1.4, s)
  // Spine
  ctx.moveTo(-s * 0.7, -s * 0.5)
  ctx.lineTo(-s * 0.5, -s * 0.6)
  ctx.lineTo(s * 0.9, -s * 0.6)
  ctx.lineTo(s * 0.7, -s * 0.5)
  // Pages
  ctx.moveTo(-s * 0.5, -s * 0.6)
  ctx.lineTo(-s * 0.5, s * 0.6)
  ctx.lineTo(s * 0.9, s * 0.6)
  ctx.lineTo(s * 0.9, -s * 0.6)

  ctx.stroke()
  ctx.restore()
}

function drawDocument(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, rotation: number) {
  const s = size / 2

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.strokeStyle = color
  ctx.lineWidth = 3

  ctx.beginPath()
  // Paper
  ctx.rect(-s * 0.6, -s * 0.7, s * 1.2, s * 1.4)
  // Lines
  ctx.moveTo(-s * 0.4, -s * 0.4)
  ctx.lineTo(s * 0.4, -s * 0.4)
  ctx.moveTo(-s * 0.4, -s * 0.1)
  ctx.lineTo(s * 0.4, -s * 0.1)
  ctx.moveTo(-s * 0.4, s * 0.2)
  ctx.lineTo(s * 0.4, s * 0.2)
  ctx.moveTo(-s * 0.4, s * 0.5)
  ctx.lineTo(s * 0.2, s * 0.5)

  ctx.stroke()
  ctx.restore()
}

function drawBubble(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, size / 2, 0, Math.PI * 2)
  ctx.fill()
}

export default function EnhancedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isMounted, setIsMounted] = useState(false)

  // Handle mounting
  useEffect(() => {
    setIsMounted(true)
    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }, [])

  // Handle resize
  useEffect(() => {
    if (!isMounted) return

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMounted])

  // Handle animation
  useEffect(() => {
    if (!isMounted || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Define colors with slightly reduced opacity
    const colors = [
      "rgba(33, 85, 164, 0.25)", // Primary blue - reduced opacity
      "rgba(65, 105, 225, 0.22)", // Royal blue - reduced opacity
      "rgba(30, 144, 255, 0.20)", // Dodger blue - reduced opacity
      "rgba(0, 71, 171, 0.18)", // Cobalt blue - reduced opacity
    ]

    // Define shapes with proper type annotations
    const shapes: Shape[] = [
      { 
        type: "scale", 
        draw: (x: number, y: number, size: number, color: string, rotation: number) => 
          drawScale(ctx, x, y, size, color, rotation) 
      },
      { 
        type: "book", 
        draw: (x: number, y: number, size: number, color: string, rotation: number) => 
          drawBook(ctx, x, y, size, color, rotation) 
      },
      { 
        type: "document", 
        draw: (x: number, y: number, size: number, color: string, rotation: number) => 
          drawDocument(ctx, x, y, size, color, rotation) 
      },
      { 
        type: "bubble", 
        draw: (x: number, y: number, size: number, color: string, rotation: number) => 
          drawBubble(ctx, x, y, size, color) 
      },
    ]

    // Create particles with proper typing
    const particles: Particle[] = []
    const particleCount = 40 // Reduced from 70 for less density

    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 80 + 40
      const shapeIndex = Math.floor(Math.random() * shapes.length)
      const color = colors[Math.floor(Math.random() * colors.length)]

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: size,
        baseSize: size,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        color: color,
        shape: shapes[shapeIndex],
        opacity: Math.random() * 0.4 + 0.3,
        pulse: {
          active: Math.random() > 0.3,
          speed: 0.01 + Math.random() * 0.015,
          min: 0.8,
          max: 1.2,
          direction: 1,
        },
        colorShift: {
          active: Math.random() > 0.5,
          hue: Math.random() * 30 - 15,
          speed: 0.2 + Math.random() * 0.3,
        },
      })
    }

    // Animation loop
    let frameCount = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frameCount++

      // Draw particles
      particles.forEach((particle) => {
        // Move particle
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.rotation += particle.rotationSpeed

        // Pulse size if active
        if (particle.pulse.active) {
          const pulseAmount = Math.sin(frameCount * particle.pulse.speed) * 0.2 + 0.8
          particle.size = particle.baseSize * pulseAmount
        }

        // Color shift if active
        let color = particle.color
        if (particle.colorShift.active) {
          // Extract RGB from rgba string
          const rgba = particle.color.match(/rgba?$$(\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?$$/)
          if (rgba) {
            const r = Number.parseInt(rgba[1])
            const g = Number.parseInt(rgba[2])
            const b = Number.parseInt(rgba[3])

            // Apply subtle color shift based on time
            const shift = Math.sin(frameCount * particle.colorShift.speed * 0.01) * particle.colorShift.hue
            color = `rgba(${Math.min(255, Math.max(0, r + shift))}, ${Math.min(255, Math.max(0, g + shift))}, ${Math.min(255, Math.max(0, b + shift))}, ${particle.opacity})`
          }
        }

        // Wrap around edges
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity

        // Draw the shape
        particle.shape.draw(particle.x, particle.y, particle.size, color, particle.rotation)

        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()
  }, [isMounted, dimensions])

  if (!isMounted) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{
        width: dimensions.width,
        height: dimensions.height
      }}
    />
  )
}

