"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause } from "lucide-react"
import { cn } from "@/lib/utils"

interface AudioPlayerProps {
  src: string
  isOwn?: boolean
}

export function AudioPlayer({ src, isOwn = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const audio = new Audio(src)
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
    })

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    return () => {
      audio.pause()
      audio.src = ''
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [src])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      <button
        onClick={togglePlay}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors",
          isOwn 
            ? "bg-brand-600 hover:bg-brand-700 text-white" 
            : "bg-surface-700 hover:bg-surface-600 text-white"
        )}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col gap-1">
        {/* Waveform visualization */}
        <div className="h-6 flex items-center gap-0.5">
          {Array.from({ length: 30 }).map((_, i) => {
            const barProgress = (i / 30) * 100
            const isActive = barProgress <= progress
            const height = Math.sin(i * 0.5) * 8 + 8
            
            return (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full transition-colors",
                  isActive 
                    ? isOwn ? "bg-white" : "bg-brand-500"
                    : isOwn ? "bg-brand-400/30" : "bg-surface-600"
                )}
                style={{ height: `${height}px` }}
              />
            )
          })}
        </div>

        {/* Time display */}
        <div className="flex justify-between text-[10px]">
          <span className={isOwn ? "text-brand-100" : "text-surface-400"}>
            {formatTime(currentTime)}
          </span>
          <span className={isOwn ? "text-brand-200" : "text-surface-500"}>
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}
