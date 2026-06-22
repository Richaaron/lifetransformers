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
      <div className="hidden lg:flex flex-col justify-between bg-brand-900 p-12 text-brand-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-brand opacity-20 pointer-events-none" />
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
