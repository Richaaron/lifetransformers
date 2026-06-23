interface OnlineIndicatorProps {
  isOnline: boolean
  /** Size of the dot. Default: "md" */
  size?: "sm" | "md" | "lg"
  /** Show "Online" / "Offline" label next to dot */
  showLabel?: boolean
  className?: string
}

const sizeClasses = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3.5 h-3.5",
}

/**
 * OnlineIndicator — a coloured dot (green = online, grey = offline).
 * Wrap the parent avatar in `relative` to use as an absolute overlay.
 */
export function OnlineIndicator({ isOnline, size = "md", showLabel = false, className = "" }: OnlineIndicatorProps) {
  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <span className="relative flex">
        <span
          className={`
            ${sizeClasses[size]} rounded-full
            ${isOnline
              ? "bg-emerald-500 shadow-[0_0_6px_2px_rgba(16,185,129,0.5)]"
              : "bg-surface-500"
            }
          `}
        />
        {/* Ripple animation for online users */}
        {isOnline && (
          <span
            className={`
              absolute inline-flex ${sizeClasses[size]} rounded-full
              bg-emerald-400 opacity-60 animate-ping
            `}
          />
        )}
      </span>
      {showLabel && (
        <span className={`text-xs font-medium ${isOnline ? "text-emerald-400" : "text-surface-500"}`}>
          {isOnline ? "Online" : "Offline"}
        </span>
      )}
    </span>
  )
}
