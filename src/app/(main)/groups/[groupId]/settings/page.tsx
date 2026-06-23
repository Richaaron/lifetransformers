"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2, Link as LinkIcon, ImagePlus, Camera, X } from "lucide-react"
import Link from "next/link"
import { formatFileSize } from "@/lib/utils/file-upload"
import { uploadMediaAction } from "@/lib/actions/media"

export default function GroupSettingsPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params)
  const router = useRouter()
  const [group, setGroup] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [privacy, setPrivacy] = useState("public")
  
  const [currentCover, setCurrentCover] = useState("")
  const [previewCover, setPreviewCover] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [generatingInvite, setGeneratingInvite] = useState(false)

  useEffect(() => {
    loadGroup()
  }, [])

  const loadGroup = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Verify admin
    const { data: member } = await supabase
      .from("group_members")
      .select("role")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .single()

    if (!member || member.role !== "admin") {
      router.push(`/groups/${groupId}`)
      return
    }

    const { data: g } = await supabase.from("groups").select("*").eq("id", groupId).single()
    if (g) {
      setGroup(g)
      setName(g.name)
      setDescription(g.description || "")
      setPrivacy(g.privacy)
      setCurrentCover(g.cover_url || "")
    }

    // Check for existing invite
    const { data: inv } = await supabase
      .from("group_invites")
      .select("code")
      .eq("group_id", groupId)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle()

    if (inv) setInviteCode(inv.code)

    setLoading(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) return alert("Cover image must be less than 10MB")
    setSelectedFile(file)
    setPreviewCover(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    let coverUrl = currentCover

    if (selectedFile && user) {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("bucket", "posts")
      formData.append("userId", user.id)
      const { url } = await uploadMediaAction(formData)
      if (url) coverUrl = url
    }

    const { error } = await supabase
      .from("groups")
      .update({
        name,
        description,
        privacy,
        cover_url: coverUrl,
      })
      .eq("id", groupId)

    setSaving(false)
    if (!error) router.push(`/groups/${groupId}`)
  }

  const generateInvite = async () => {
    setGeneratingInvite(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Invalidate old invites
    await supabase.from("group_invites").delete().eq("group_id", groupId)

    // Generate random 8 char code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    
    // Expires in 7 days
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { error } = await supabase.from("group_invites").insert({
      group_id: groupId,
      code,
      created_by: user.id,
      expires_at: expiresAt.toISOString(),
      max_uses: 100
    })

    if (!error) setInviteCode(code)
    setGeneratingInvite(false)
  }

  if (loading) return null

  const displayCover = previewCover || currentCover

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/groups/${groupId}`} className="text-surface-400 hover:text-white transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Group Settings</h1>
        </div>
      </div>

      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
          <CardDescription>Upload a banner for your group</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-48 bg-surface-800 group cursor-pointer rounded-xl overflow-hidden border border-surface-700" onClick={() => coverInputRef.current?.click()}>
            {displayCover ? (
              <img src={displayCover} alt="Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-surface-800 to-surface-900 flex flex-col items-center justify-center gap-2">
                <ImagePlus className="w-8 h-8 text-surface-500" />
                <span className="text-sm text-surface-500">Click to upload cover photo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Camera className="w-6 h-6 text-white" />
              <span className="text-white text-sm font-medium">Change Cover</span>
            </div>
          </div>
          <input ref={coverInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          {selectedFile && <p className="text-xs text-surface-400 mt-2">Selected: {selectedFile.name}</p>}
        </CardContent>
      </Card>

      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle>Group Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Group Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>Privacy</Label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="w-full bg-surface-950 border border-surface-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-500"
            >
              <option value="public">Public (Anyone can see and join)</option>
              <option value="private">Private (Invite only)</option>
            </select>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle>Invite Link</CardTitle>
          <CardDescription>Generate a link to invite others to join your group</CardDescription>
        </CardHeader>
        <CardContent>
          {inviteCode ? (
            <div className="space-y-4">
              <div className="p-4 bg-surface-950 border border-surface-800 rounded-lg flex items-center justify-between">
                <span className="text-brand-400 font-mono text-lg">{inviteCode}</span>
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/groups/invite/${inviteCode}`)
                  alert("Link copied!")
                }}>
                  <LinkIcon className="w-4 h-4 mr-2" /> Copy Link
                </Button>
              </div>
              <Button variant="destructive" size="sm" onClick={generateInvite} disabled={generatingInvite}>
                Revoke & Generate New Link
              </Button>
            </div>
          ) : (
            <Button onClick={generateInvite} disabled={generatingInvite}>
              {generatingInvite ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Generate Invite Link
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
