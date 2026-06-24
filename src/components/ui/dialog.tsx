"use client"

import * as React from "react"
import { X } from "lucide-react"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined)

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const currentOpen = isControlled ? open : internalOpen
  const setOpen = isControlled ? onOpenChange! : setInternalOpen

  return (
    <DialogContext.Provider value={{ open: currentOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ asChild, children, ...props }: { asChild?: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen, open } = React.useContext(DialogContext)!
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<any>
    return React.cloneElement(child, {
      ...child.props,
      onClick: (e: any) => {
        child.props.onClick?.(e)
        setOpen(!open)
      },
    })
  }
  return <button {...props} onClick={() => setOpen(!open)}>{children}</button>
}

export function DialogContent({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const { open, setOpen } = React.useContext(DialogContext)!
  const overlayRef = React.useRef<HTMLDivElement>(null)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        onClick={(e) => {
          if (e.target === overlayRef.current) setOpen(false)
        }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        {...props}
        className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl ${className}`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`}>{children}</div>
}

export function DialogTitle({ children, className, ...props }: { children: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 {...props} className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h2>
}
