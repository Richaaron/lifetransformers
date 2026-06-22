"use client"

import { useActionState } from "react"
import { createGroup } from "@/lib/actions/groups"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import type { ActionResult } from "@/lib/types"

const initialState: ActionResult<{ id: string }> = {
  error: "",
}

export default function CreateGroupPage() {
  const [state, formAction, isPending] = useActionState(createGroup, initialState)
  const router = useRouter()

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Group</CardTitle>
          <CardDescription>
            Bring people together around a shared interest or topic.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="e.g., Sunday Service Volunteers"
                maxLength={50}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="What is this group about?"
                maxLength={255}
                className="resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label>Privacy</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-surface-700 rounded-lg cursor-pointer bg-surface-900 hover:bg-surface-800 transition-colors">
                  <input type="radio" name="privacy" value="public" defaultChecked className="text-brand-500 w-4 h-4 focus:ring-brand-500 focus:ring-offset-surface-900" />
                  <div>
                    <div className="font-medium text-white">Public</div>
                    <div className="text-sm text-surface-400">Anyone in the network can see and join this group.</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-surface-700 rounded-lg cursor-pointer bg-surface-900 hover:bg-surface-800 transition-colors">
                  <input type="radio" name="privacy" value="private" className="text-brand-500 w-4 h-4 focus:ring-brand-500 focus:ring-offset-surface-900" />
                  <div>
                    <div className="font-medium text-white">Private</div>
                    <div className="text-sm text-surface-400">Only members can see posts. Requires an invite link to join.</div>
                  </div>
                </label>
              </div>
            </div>

            {state?.error && (
              <div className="p-3 rounded-md bg-destructive/20 border border-destructive/50 text-destructive-foreground text-sm">
                {state.error}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-3 pt-6 border-t border-surface-800">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Group"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
