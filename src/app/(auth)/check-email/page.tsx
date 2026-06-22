import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Check Your Email - Life Transformers",
}

export default function CheckEmailPage() {
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
        <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
        <CardDescription className="text-center">
          We've sent a confirmation link to your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center p-6 bg-surface-800/50 rounded-lg">
          <Mail className="w-16 h-16 text-brand-500 mb-4" />
          <p className="text-surface-200 text-center mb-2">
            Click the link in your email to verify your account and complete registration.
          </p>
          <p className="text-surface-400 text-sm text-center">
            If you don't see the email, check your spam folder.
          </p>
        </div>

        <div className="space-y-3">
          <Link 
            href="/login"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
          
          <p className="text-center text-sm text-surface-400">
            Need help? Contact your administrator
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
