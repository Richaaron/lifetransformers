"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Send, X } from "lucide-react"

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void
  onCancel: () => void
}

export function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startRecording()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert('Could not access microphone. Please allow microphone access.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const handleSend = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob)
    }
  }

  const handleDiscard = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    onCancel()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-3 w-full">
      {!audioBlob ? (
        <>
          {/* Recording in progress */}
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-surface-600'}`} />
            <span className="text-sm font-mono text-surface-300">
              {formatDuration(duration)}
            </span>
            <div className="flex-1 h-8 bg-surface-800 rounded-lg overflow-hidden flex items-center px-3">
              {isRecording && (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-brand-500 rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 20 + 4}px`,
                        animationDelay: `${i * 0.05}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            className="h-10 w-10 rounded-full"
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          <Button
            onClick={handleDiscard}
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full text-surface-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </>
      ) : (
        <>
          {/* Playback preview */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-3 h-3 rounded-full bg-brand-500" />
            <span className="text-sm font-mono text-surface-300">
              {formatDuration(duration)}
            </span>
            {audioUrl && (
              <audio src={audioUrl} controls className="h-10 flex-1" />
            )}
          </div>

          <Button
            onClick={handleDiscard}
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full text-surface-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>

          <Button
            onClick={handleSend}
            size="icon"
            className="h-10 w-10 rounded-full bg-brand-500 hover:bg-brand-600"
          >
            <Send className="w-5 h-5" />
          </Button>
        </>
      )}
    </div>
  )
}
