"use client"

import React from "react"
import { Plus, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

interface FabProps {
  onClick?: () => void
  icon?: "plus" | "pencil"
  size?: "small" | "medium" | "large"
  extended?: boolean
  label?: string
  className?: string
}

export function Fab({
  onClick,
  icon = "plus",
  size = "medium",
  extended = false,
  label,
  className,
}: FabProps) {
  const Icon = icon === "plus" ? Plus : Pencil

  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-14 h-14",
    large: "w-16 h-16",
  }

  const iconSizeClasses = {
    small: "w-5 h-5",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-50 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-500/50",
        "bg-brand-500 hover:bg-brand-400 text-white",
        sizeClasses[size],
        extended && "px-6 w-auto",
        className
      )}
      style={{
        boxShadow: "0 6px 20px rgba(234,179,8,0.45), 0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <Icon className={cn(iconSizeClasses[size], extended && "mr-2")} />
      {extended && label && <span className="font-semibold">{label}</span>}
    </button>
  )
}
