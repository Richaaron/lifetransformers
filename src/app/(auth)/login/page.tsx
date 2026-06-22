import { Metadata } from "next"
import { LoginForm } from "@/components/auth/LoginForm"

export const metadata: Metadata = {
  title: "Sign In - Life Transformers",
  description: "Sign in to your Life Transformers account",
}

export default function LoginPage() {
  return <LoginForm />
}
