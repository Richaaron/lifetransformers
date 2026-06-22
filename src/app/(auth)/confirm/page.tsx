import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle, XCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Email Confirmed - Life Transformers",
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string }>
}) {
  const { token_hash, type } = await searchParams

  let success = false
  let error = null

  if (token_hash && type) {
    const supabase = await createClient()
    
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })

    if (verifyError) {
      error = verifyError.message
    } else {
      success = true
    }
  } else {
    error = "Invalid confirmation link"
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
        <CardTitle className="text-2xl text-center">
          {success ? "Email Confirmed!" : "Confirmation Failed"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center p-6 bg-surface-800/50 rounded-lg">
          {success ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-surface-200 text-center mb-2">
                Your email has been verified successfully!
              </p>
              <p className="text-surface-400 text-sm text-center">
                You can now sign in to your account.
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <p className="text-surface-200 text-center mb-2">
                {error || "Something went wrong with the confirmation."}
              </p>
              <p className="text-surface-400 text-sm text-center">
                The link may have expired or is invalid.
              </p>
            </>
          )}
        </div>

        <div className="space-y-3">
          <Link 
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
          >
            {success ? "Sign In" : "Try Again"}
          </Link>
          
          {success && (
            <p className="text-center text-sm text-surface-400">
              Welcome to Life Transformers!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
