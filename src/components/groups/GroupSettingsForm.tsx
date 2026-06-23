"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateGroupDetails, deleteGroup } from "@/lib/actions/group-admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save, Trash2 } from "lucide-react"

interface GroupSettingsFormProps {
  group: {
    id: string
    name: string
    description: string | null
    privacy: "public" | "private"
    current_user_is_owner: boolean
  }
}

export function GroupSettingsForm({ group }: GroupSettingsFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSave = (formData: FormData) => {
    setError("")
    setSuccess("")
    startTransition(async () => {
      const result = await updateGroupDetails(group.id, formData)
      if (result?.error) setError(result.error)
      else {
        setSuccess("Group settings saved successfully!")
        router.refresh()
      }
    })
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete this group? This cannot be undone.`)) return
    setIsDeleting(true)
    const result = await deleteGroup(group.id)
    if (result?.error) {
      setError(result.error)
      setIsDeleting(false)
    }
    // On success, deleteGroup redirects to /groups
  }

  return (
    <div className="space-y-6">
      {/* Group Details */}
      <Card>
        <CardHeader>
          <CardTitle>Group Settings</CardTitle>
          <CardDescription>Update the name, description, and privacy of your group.</CardDescription>
        </CardHeader>
        <form action={handleSave}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input id="name" name="name" defaultValue={group.name} required maxLength={50} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={group.description || ""}
                maxLength={255}
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-3">
              <Label>Privacy</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-surface-700 rounded-lg cursor-pointer bg-surface-900 hover:bg-surface-800 transition-colors">
                  <input type="radio" name="privacy" value="public" defaultChecked={group.privacy === "public"} className="w-4 h-4 text-brand-500" />
                  <div>
                    <div className="font-medium text-white text-sm">Public</div>
                    <div className="text-xs text-surface-400">Anyone in the network can see and join.</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-surface-700 rounded-lg cursor-pointer bg-surface-900 hover:bg-surface-800 transition-colors">
                  <input type="radio" name="privacy" value="private" defaultChecked={group.privacy === "private"} className="w-4 h-4 text-brand-500" />
                  <div>
                    <div className="font-medium text-white text-sm">Private</div>
                    <div className="text-xs text-surface-400">Only members can see posts. Invite-only.</div>
                  </div>
                </label>
              </div>
            </div>
            {error && <p className="text-sm text-red-400 bg-red-900/20 border border-red-900/40 p-3 rounded-lg">{error}</p>}
            {success && <p className="text-sm text-green-400 bg-green-900/20 border border-green-900/40 p-3 rounded-lg">{success}</p>}
          </CardContent>
          <CardFooter className="border-t border-surface-800 pt-4">
            <Button type="submit" className="gap-2" disabled={isPending}>
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Danger Zone — owner only */}
      {group.current_user_is_owner && (
        <Card className="border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-red-900/10 border border-red-900/30 rounded-lg">
              <div>
                <p className="font-medium text-white text-sm">Delete this Group</p>
                <p className="text-xs text-surface-400 mt-0.5">Permanently removes the group and all its posts.</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="gap-2 shrink-0 ml-4"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Group
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
