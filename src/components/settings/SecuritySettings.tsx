"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, ShieldAlert, ShieldCheck, Smartphone, Loader2, Copy, Check } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useRouter } from "next/navigation"

export function SecuritySettings() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [factors, setFactors] = useState<any[]>([])
  
  // Enrollment state
  const [enrolling, setEnrolling] = useState(false)
  const [factorId, setFactorId] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [verifyCode, setVerifyCode] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    loadFactors()
  }, [])

  const loadFactors = async () => {
    setLoading(true)
    const { data, error } = await supabase.auth.mfa.listFactors()
    if (data?.all) {
      setFactors(data.all.filter(f => f.status === 'verified'))
    }
    setLoading(false)
  }

  const startEnrollment = async () => {
    setEnrolling(true)
    setError("")
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
      if (error) throw error
      
      setFactorId(data.id)
      setQrCode(data.totp.qr_code)
      setSecret(data.totp.secret)
    } catch (err: any) {
      setError(err.message)
      setEnrolling(false)
    }
  }

  const verifyEnrollment = async () => {
    if (!verifyCode || verifyCode.length !== 6) {
      setError("Please enter a valid 6-digit code")
      return
    }
    setVerifying(true)
    setError("")
    
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode
      })
      if (error) throw error

      // Refresh session
      await supabase.auth.refreshSession()
      
      setEnrolling(false)
      setFactorId("")
      setQrCode("")
      setSecret("")
      setVerifyCode("")
      await loadFactors()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setVerifying(false)
    }
  }

  const unenroll = async (id: string) => {
    if (!confirm("Are you sure you want to disable Two-Factor Authentication?")) return
    
    setLoading(true)
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: id })
      if (error) throw error
      await loadFactors()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    )
  }

  const has2FA = factors.length > 0

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-400" />
              Two-Factor Authentication (2FA)
            </h3>
            <p className="text-surface-400 text-sm mt-1 max-w-lg">
              Add an extra layer of security to your account. When enabled, you'll need to enter a code from an authenticator app when signing in.
            </p>
          </div>
          {has2FA ? (
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Enabled
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-surface-800 border border-surface-700 text-surface-400 text-xs font-semibold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Disabled
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {!has2FA && !enrolling && (
          <Button 
            onClick={startEnrollment}
            className="bg-brand-500 hover:bg-brand-400 text-surface-950 font-semibold"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Enable Authenticator App
          </Button>
        )}

        {has2FA && (
          <div className="pt-4 border-t border-white/5">
            <h4 className="text-sm font-medium text-surface-200 mb-3">Active Authenticators</h4>
            {factors.map(factor => (
              <div key={factor.id} className="flex items-center justify-between p-4 bg-surface-800/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-brand-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Authenticator App</div>
                    <div className="text-xs text-surface-400">Added {new Date(factor.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => unenroll(factor.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}

        {enrolling && (
          <div className="pt-6 border-t border-white/5 space-y-6 animate-fade-in">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">1. Scan QR Code</h4>
              <p className="text-sm text-surface-400">
                Use an authenticator app (like Google Authenticator, Authy, or 1Password) to scan this QR code.
              </p>
              
              {qrCode && (
                <div className="p-4 bg-white rounded-xl inline-block">
                  <QRCodeSVG value={qrCode} size={200} />
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-surface-500 uppercase tracking-wider font-medium">Or enter code manually</p>
                <div className="flex items-center gap-2 max-w-sm">
                  <code className="flex-1 p-2.5 bg-surface-900 border border-surface-800 rounded-lg text-sm text-brand-300 font-mono text-center tracking-widest">
                    {secret}
                  </code>
                  <Button variant="outline" size="icon" onClick={copySecret} className="shrink-0 bg-surface-800 border-surface-700 hover:bg-surface-700">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-surface-400" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <h4 className="text-lg font-medium text-white">2. Verify Setup</h4>
              <p className="text-sm text-surface-400">
                Enter the 6-digit code generated by your app.
              </p>
              <div className="flex gap-3 max-w-sm">
                <Input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  className="bg-surface-900 border-surface-700 text-center tracking-[0.5em] text-lg h-12 font-mono"
                />
                <Button 
                  onClick={verifyEnrollment}
                  disabled={verifying || verifyCode.length !== 6}
                  className="h-12 px-6 bg-brand-500 hover:bg-brand-400 text-surface-950 font-semibold"
                >
                  {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify"}
                </Button>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => {
                setEnrolling(false)
                setError("")
              }}
              className="text-surface-400 hover:text-white"
            >
              Cancel Setup
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
