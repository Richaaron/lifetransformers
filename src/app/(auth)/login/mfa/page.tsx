import { Metadata } from "next"
import { MfaVerificationForm } from "@/components/auth/MfaVerificationForm"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Verify Identity - Life Transformers",
  description: "Two-Factor Authentication",
}

export default function MfaPage() {
  return <MfaVerificationForm />
}
