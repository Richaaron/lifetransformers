"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { LANGUAGES } from "@/lib/constants/languages"

interface LanguageSelectorProps {
  value: string
  onChange: (language: string) => void
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  
  const selectedLanguage = LANGUAGES.find(l => l.code === value) || LANGUAGES[0]

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-surface-400 hover:text-white h-8"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{selectedLanguage.flag} {selectedLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 max-h-[300px] overflow-y-auto bg-surface-800 border-surface-700"
      >
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              onChange(language.code)
              setOpen(false)
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {value === language.code && (
              <Check className="w-4 h-4 text-brand-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
