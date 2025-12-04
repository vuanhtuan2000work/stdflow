'use client'

import { useEffect } from 'react'

export function Confetti() {
  useEffect(() => {
    // Simple confetti effect using CSS animations
    const confettiCount = 50
    const confettiContainer = document.createElement('div')
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50'
    document.body.appendChild(confettiContainer)

    const colors = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const left = Math.random() * 100
      const delay = Math.random() * 3
      const duration = 3 + Math.random() * 2

      confetti.style.cssText = `
        position: absolute;
        left: ${left}%;
        width: 10px;
        height: 10px;
        background-color: ${color};
        border-radius: 50%;
        animation: confetti-fall ${duration}s ${delay}s ease-out forwards;
      `

      confettiContainer.appendChild(confetti)
    }

    // Add animation keyframes
    const style = document.createElement('style')
    style.textContent = `
      @keyframes confetti-fall {
        0% {
          transform: translateY(-100vh) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    // Cleanup after animation
    setTimeout(() => {
      document.body.removeChild(confettiContainer)
      document.head.removeChild(style)
    }, 5000)

    return () => {
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer)
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  return null
}


