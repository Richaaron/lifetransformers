import { Metadata } from "next"
import { SignupForm } from "@/components/auth/SignupForm"

export const metadata: Metadata = {
  title: "Request Access - Life Transformers",
  description: "Request access to the Life Transformers network",
}

export default function SignupPage() {
  return <SignupForm />
}
