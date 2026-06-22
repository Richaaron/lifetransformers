"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import type { ActionResult } from "@/lib/types"

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(6),
})

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(2).max(50),
})

export async function loginAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const identifier = formData.get("identifier")
  const password = formData.get("password")

  const parsed = loginSchema.safeParse({ identifier, password })
  if (!parsed.success) {
    return { error: "Invalid username/email or password." }
  }

  const supabase = await createClient()

  let email = parsed.data.identifier

  // If it doesn't look like an email, treat it as a username and look up the email
  if (!parsed.data.identifier.includes("@")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", parsed.data.identifier)
      .single()

    if (!profile) {
      return { error: "Invalid username/email or password." }
    }

    // Get the email from auth.users via the profile id
    const { data: authUser } = await supabase.auth.admin.getUserById(profile.id)
    if (!authUser?.user?.email) {
      return { error: "Invalid username/email or password." }
    }
    email = authUser.user.email
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/feed")
}

export async function signupAction(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email")
  const password = formData.get("password")
  const username = formData.get("username")
  const displayName = formData.get("displayName")

  const parsed = signupSchema.safeParse({
    email,
    password,
    username,
    displayName,
  })

  if (!parsed.success) {
    return { error: "Invalid form data. Please check your inputs." }
  }

  const supabase = await createClient()

  // Verify username is not taken before calling auth service
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", parsed.data.username)
    .single()

  if (existingUser) {
    return { error: "Username is already taken." }
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        username: parsed.data.username,
        display_name: parsed.data.displayName,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Redirect to check email page for email confirmation
  redirect("/check-email")
}

export async function resendConfirmationEmail(email: string): Promise<ActionResult> {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
  })

  if (error) {
    return { error: error.message }
  }

  return { data: { message: "Confirmation email sent!" } }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
