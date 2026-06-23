"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldCheck, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function MfaVerificationForm() {
  const router = useRouter()
  const supabase = createClient()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) return

    setLoading(true)
    setError("")

    try {
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors()
      if (factorsError) throw factorsError

      const totpFactor = factorsData.all.find(f => f.factor_type === 'totp' && f.status === 'verified')
      
      if (!totpFactor) {
        throw new Error("No verified authenticator app found.")
      }

      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: totpFactor.id,
        code
      })

      if (error) throw error

      router.push("/feed")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="glass-strong rounded-2xl p-8 shadow-[0_32px_64px_rgba(0,0,0,0.6)] border border-white/10 text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-brand-400" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h2>
      <p className="text-surface-400 mb-8 text-sm max-w-sm mx-auto">
        Enter the 6-digit code from your authenticator app to continue.
      </p>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-center">
          <Input
            type="text"
            placeholder="000000"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="w-48 bg-surface-900 border-surface-700 text-center tracking-[0.5em] text-2xl h-14 font-mono"
            autoFocus
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-surface-950"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Verify"}
        </Button>
      </form>
    </div>
  )
}
