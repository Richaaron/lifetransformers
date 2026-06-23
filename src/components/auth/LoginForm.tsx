"use client"

import { useActionState } from "react"
import { loginAction } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"

const initialState = { error: "" }

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="glass-strong rounded-2xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.6)] border border-white/10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
        <p className="text-surface-400">Sign in to your Life Transformers account.</p>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-surface-200 text-sm font-medium">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="pl-10 h-12 bg-surface-800/50 border-surface-700/60 focus:border-brand-500/60 transition-all duration-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-surface-200 text-sm font-medium">Password</Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="pl-10 h-12 bg-surface-800/50 border-surface-700/60 focus:border-brand-500/60 transition-all duration-200"
            />
          </div>
        </div>

        {state?.error && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm animate-fade-up">
            <span className="shrink-0">⚠</span>
            {state.error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-surface-950 shadow-[0_4px_20px_rgba(234,179,8,0.3)] hover:shadow-[0_4px_28px_rgba(234,179,8,0.5)] transition-all duration-200 press-effect gap-2"
        >
          {isPending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
          ) : (
            <>Sign in <ArrowRight className="w-4 h-4" /></>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-surface-700/40 text-center">
        <p className="text-surface-400 text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  )
}
