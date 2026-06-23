"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-surface-800 animate-pulse flex items-center justify-center border border-surface-700" />
    )
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 hover:text-brand-400 hover:border-brand-500/50 hover:bg-brand-500/10 transition-all duration-300 group overflow-hidden"
      aria-label="Toggle theme"
    >
      <div className={`absolute transition-all duration-500 transform ${theme === 'dark' ? 'rotate-90 translate-y-8 opacity-0' : 'rotate-0 translate-y-0 opacity-100'}`}>
        <Sun className="w-5 h-5 text-amber-500" />
      </div>
      <div className={`absolute transition-all duration-500 transform ${theme === 'light' ? '-rotate-90 -translate-y-8 opacity-0' : 'rotate-0 translate-y-0 opacity-100'}`}>
        <Moon className="w-5 h-5 text-indigo-400" />
      </div>
    </button>
  )
}
