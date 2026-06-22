"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Languages, Loader2, X } from "lucide-react"
import { translateText } from "@/lib/actions/translate"

interface TranslateButtonProps {
  text: string
  targetLanguage: string
}

export function TranslateButton({ text, targetLanguage }: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTranslate = async () => {
    if (translatedText) {
      // Toggle off translation
      setTranslatedText(null)
      return
    }

    setIsTranslating(true)
    setError(null)

    const result = await translateText(text, targetLanguage)

    if ("error" in result) {
      setError(result.error)
    } else {
      setTranslatedText(result.translatedText)
    }

    setIsTranslating(false)
  }

  return (
    <div className="mt-2">
      <Button
        onClick={handleTranslate}
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-[10px] gap-1 text-surface-400 hover:text-brand-500"
        disabled={isTranslating}
      >
        {isTranslating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : translatedText ? (
          <X className="w-3 h-3" />
        ) : (
          <Languages className="w-3 h-3" />
        )}
        <span>
          {isTranslating 
            ? "Translating..." 
            : translatedText 
              ? "Show original" 
              : "Translate"
          }
        </span>
      </Button>

      {translatedText && (
        <div className="mt-1 p-2 rounded-md bg-surface-700/50 text-sm text-surface-200">
          {translatedText}
        </div>
      )}

      {error && (
        <div className="mt-1 text-[10px] text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
