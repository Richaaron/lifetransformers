"use client"

import { useActionState } from "react"
import { signupAction } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import type { ActionResult } from "@/lib/types"

const initialState: ActionResult = {
  error: "",
}

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState)

  return (
    <Card className="w-full">
      <CardHeader className="items-center">
        <Image
          src="/logo.png"
          alt="Life Transformers Logo"
          width={120}
          height={120}
          className="mb-4 rounded-full"
          priority
        />
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Join the Life Transformers network. Sign up with your email and you're in.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                name="displayName"
                required
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                required
                placeholder="johndoe"
                pattern="[a-zA-Z0-9_]+"
                title="Only letters, numbers, and underscores allowed"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
            />
            <p className="text-xs text-surface-400">Must be at least 6 characters.</p>
          </div>
          {state?.error && (
            <div className="p-3 rounded-md bg-destructive/20 border border-destructive/50 text-destructive-foreground text-sm">
              {state.error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating account..." : "Create Account"}
          </Button>
          <div className="text-center text-sm text-surface-400">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
