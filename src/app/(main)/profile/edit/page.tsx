"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { getInitials } from "@/lib/utils"
import { Loader2, CheckCircle, Camera, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { uploadMediaAction } from "@/lib/actions/media"
import { formatFileSize } from "@/lib/utils/file-upload"

export default function EditProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [location, setLocation] = useState("")
  const [hobby, setHobby] = useState("")
  const [bio, setBio] = useState("")
  const [currentAvatar, setCurrentAvatar] = useState("")
  const [previewAvatar, setPreviewAvatar] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/login")
      return
    }

    setUserId(user.id)

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profile) {
      setDisplayName(profile.display_name || "")
      setUsername(profile.username || "")
      setCurrentAvatar(profile.avatar_url || "")
      setDateOfBirth(profile.date_of_birth || "")
      setLocation(profile.location || "")
      setHobby(profile.hobby || "")
      setBio(profile.bio || "")
    }
    setIsLoading(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    setSelectedFile(file)
    setPreviewAvatar(URL.createObjectURL(file))
    setError("")
  }

  const removeSelectedFile = () => {
    setSelectedFile(null)
    setPreviewAvatar("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    if (!displayName.trim() || !username.trim()) {
      setError("Name and username are required")
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores")
      return
    }

    setIsSaving(true)
    setError("")
    setSuccess(false)

    const supabase = createClient()

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .ilike("username", username)
      .neq("id", userId)
      .single()

    if (existing) {
      setError("Username is already taken")
      setIsSaving(false)
      return
    }

    let avatarUrl = currentAvatar

    if (selectedFile) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("bucket", "avatars")
      formData.append("userId", userId)
      const { url, error: uploadError } = await uploadMediaAction(formData)
      setIsUploading(false)

      if (uploadError) {
        setError("Failed to upload image: " + uploadError)
        setIsSaving(false)
        return
      }

      avatarUrl = url || currentAvatar
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim(),
        username: username.trim().toLowerCase(),
        avatar_url: avatarUrl || null,
        date_of_birth: dateOfBirth || null,
        location: location.trim() || null,
        hobby: hobby.trim() || null,
        bio: bio.trim() || null,
      })
      .eq("id", userId)

    if (updateError) {
      setError(updateError.message)
    } else {
      setCurrentAvatar(avatarUrl)
      setSuccess(true)
      setSelectedFile(null)
      setPreviewAvatar("")
      setTimeout(() => setSuccess(false), 3000)
    }
    setIsSaving(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    )
  }

  const displayAvatar = previewAvatar || currentAvatar

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Edit Profile</h1>

      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="w-28 h-28">
                <AvatarImage src={displayAvatar} />
                <AvatarFallback className="text-3xl">
                  {getInitials(displayName || "U")}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {selectedFile && (
              <div className="flex items-center gap-3 p-3 bg-surface-800 rounded-lg">
                <span className="text-sm text-surface-300">{selectedFile.name}</span>
                <span className="text-xs text-surface-500">{formatFileSize(selectedFile.size)}</span>
                <button onClick={removeSelectedFile} className="text-red-400 hover:text-red-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-sm text-surface-400">Click on avatar to upload a photo</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-900 border-surface-800">
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
          <CardDescription>Your display information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourusername"
              className="lowercase"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Lagos, Nigeria"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hobby">Hobby</Label>
            <Input
              id="hobby"
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              placeholder="e.g. Reading, Gaming, Cooking"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="min-h-[80px] resize-none"
              maxLength={200}
            />
            <p className="text-xs text-surface-500">{bio.length}/200 characters</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-surface-900 border-surface-800">
        <CardContent className="pt-6">
          {error && (
            <div className="p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-green-500/20 border border-green-500/50 text-green-400 text-sm flex items-center gap-2 mb-4">
              <CheckCircle className="w-4 h-4" />
              Profile updated successfully!
            </div>
          )}

          <Button onClick={handleSave} className="w-full" disabled={isSaving || isUploading}>
            {(isSaving || isUploading) && (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            )}
            {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
