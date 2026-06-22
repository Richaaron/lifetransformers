import React from "react"
import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left pane: Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 text-brand-50 relative overflow-hidden" style={{
        background: `
          radial-gradient(circle at 30% 20%, rgba(234, 179, 8, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, #1a1033 0%, #0d0d18 50%, #13131f 100%)
        `
      }}>
        {/* Decorative cross pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(234, 179, 8, 0.3) 80px, rgba(234, 179, 8, 0.3) 81px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(234, 179, 8, 0.3) 80px, rgba(234, 179, 8, 0.3) 81px)
          `
        }} />
        {/* Holy light rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none" style={{
          background: 'conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(234, 179, 8, 0.03) 10deg, transparent 20deg, transparent 40deg, rgba(147, 51, 234, 0.02) 50deg, transparent 60deg, transparent 80deg, rgba(234, 179, 8, 0.03) 90deg, transparent 100deg, transparent 120deg, rgba(99, 102, 241, 0.02) 130deg, transparent 140deg, transparent 160deg, rgba(234, 179, 8, 0.03) 170deg, transparent 180deg, transparent 200deg, rgba(147, 51, 234, 0.02) 210deg, transparent 220deg, transparent 240deg, rgba(234, 179, 8, 0.03) 250deg, transparent 260deg, transparent 280deg, rgba(99, 102, 241, 0.02) 290deg, transparent 300deg, transparent 320deg, rgba(234, 179, 8, 0.03) 330deg, transparent 340deg)'
        }} />
        <div className="relative z-10">
          <Image
            src="/logo.png"
            alt="Life Transformers Logo"
            width={100}
            height={100}
            className="mb-6 rounded-full"
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight">
            Life Transformers
          </h1>
          <p className="mt-4 text-brand-200 text-lg max-w-md">
            Welcome to the private social network for our ministry. Connect, 
            share, and grow together.
          </p>
        </div>
        <div className="relative z-10 text-brand-300 text-sm">
          &copy; {new Date().getFullYear()} Life Transformers Ministry. Closed network.
        </div>
      </div>

      {/* Right pane: Form */}
      <div className="flex items-center justify-center p-8 bg-surface-950">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden text-center mb-8">
            <Image
              src="/logo.png"
              alt="Life Transformers Logo"
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-full"
              priority
            />
            <h1 className="text-3xl font-bold text-white">Life Transformers</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
