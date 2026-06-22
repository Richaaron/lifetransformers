"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isLoading) return

    setIsLoading(true)
    setError("")

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setIsLoading(false)
    } else {
      setIsSent(true)
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="items-center">
        <Image
          src="/logo.png"
          alt="Life Transformers Logo"
          width={100}
          height={100}
          className="mb-4 rounded-full"
          priority
        />
        <CardTitle className="text-2xl">Forgot Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email and we'll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent ? (
          <div className="flex flex-col items-center justify-center p-6 bg-surface-800/50 rounded-lg">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <p className="text-surface-200 text-center mb-2">
              Check your email!
            </p>
            <p className="text-surface-400 text-sm text-center">
              We sent a password reset link to <span className="text-white font-medium">{email}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/20 border border-destructive/50 text-destructive-foreground text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !email}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <Link 
          href="/login"
          className="flex items-center gap-2 text-sm text-surface-400 hover:text-white mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  )
}
