"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

interface MobileSplashScreenProps {
  onFinish: () => void
}

export function MobileSplashScreen({ onFinish }: MobileSplashScreenProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false)
      window.setTimeout(onFinish, 180)
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [onFinish])

  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.16),_transparent_55%),linear-gradient(135deg,_#020617,_#111827_60%,_#0f172a)] transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 shadow-[0_0_40px_rgba(250,204,21,0.2)]">
          <Sparkles className="h-10 w-10 text-amber-400" />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-amber-400/80">Life Transformers</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Welcome back</h1>
        <p className="mt-2 max-w-[220px] text-sm text-surface-300">A warm, mobile-first space for connection and growth.</p>
      </div>
    </div>
  )
}
