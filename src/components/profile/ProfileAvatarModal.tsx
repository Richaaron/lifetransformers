"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { X } from "lucide-react"

interface ProfileAvatarModalProps {
  avatarUrl: string | null
  displayName: string
}

export function ProfileAvatarModal({ avatarUrl, displayName }: ProfileAvatarModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="relative z-10 transition-transform hover:scale-[1.02] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-full"
      >
        <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-surface-900 shadow-2xl bg-surface-800">
          <AvatarImage src={avatarUrl || ""} />
          <AvatarFallback className="text-2xl">{getInitials(displayName)}</AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 rounded-full bg-surface-900/50 text-white hover:bg-surface-800 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
            }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-2xl w-full aspect-square sm:aspect-auto sm:max-h-[85vh] flex items-center justify-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName} 
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
              />
            ) : (
              <div className="w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-surface-800 flex items-center justify-center border-4 border-surface-700 shadow-2xl">
                <span className="text-6xl text-surface-400 font-bold">{getInitials(displayName)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
