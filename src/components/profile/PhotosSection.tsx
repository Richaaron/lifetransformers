"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import UploadWidget from "@/components/cloudinary/UploadWidget"
import { createClient } from "@/lib/supabase/client"
import { uploadPhotoAction } from "@/lib/actions/photos"

export default function PhotosSection({ initialPhotos, profileId, isOwn }: { initialPhotos: any[]; profileId: string; isOwn: boolean }) {
  const [photos, setPhotos] = useState(initialPhotos || [])
  const [caption, setCaption] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const supabase = createClient()

  const handleUpload = async (fileOrUrl: any, publicId?: string) => {
    // If widget returns a URL directly, we can insert metadata via server action
    // But our widget calls server-signed client upload; here we handle local file uploads via server action
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const form = new FormData()
    form.append("file", file)
    form.append("caption", caption)
    const { photo, error } = await uploadPhotoAction(form)
    if (error) {
      alert(error)
      setIsUploading(false)
      return
    }
    setPhotos(prev => [photo, ...prev])
    setCaption("")
    setIsUploading(false)
  }

  const handleWidgetUpload = async (url: string, publicId?: string) => {
    // Save metadata in DB via a server action that accepts url/publicId/caption
    setIsUploading(true)
    // We can call server action with a FormData containing a small blob-less payload
    const form = new FormData()
    // Create a dummy file field not required; instead send caption and public_url via fetch to an API route
    form.append("public_url", url)
    form.append("public_id", publicId || "")
    form.append("caption", caption)
    const res = await fetch("/api/photos/save", { method: "POST", body: form })
    const json = await res.json()
    if (!res.ok) { alert(json.error || "Failed to save photo"); setIsUploading(false); return }
    setPhotos(prev => [json.photo, ...prev])
    setCaption("")
    setIsUploading(false)
  }

  return (
    <div className="space-y-4">
      {isOwn && (
        <div className="p-4 bg-surface-900 border border-surface-800 rounded">
          <div className="flex gap-2">
            <input type="text" placeholder="Write a caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} className="flex-1 px-3 py-2 bg-surface-800 rounded" />
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="photos-file-input" />
            <label htmlFor="photos-file-input" className="inline-flex items-center gap-2 px-3 py-2 bg-surface-800 rounded cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload
            </label>
            <UploadWidget buttonText="Cloudinary" folder={`photos/${profileId}`} onUpload={handleWidgetUpload} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {photos.map((p: any) => (
          <div key={p.id} className="rounded overflow-hidden bg-surface-800">
            <img src={p.public_url} alt={p.caption || "Photo"} className="w-full h-40 object-cover" />
            {p.caption && <div className="p-2 text-sm text-surface-300">{p.caption}</div>}
          </div>
        ))}
        {photos.length === 0 && (
          <div className="col-span-full text-center text-surface-400 p-6">No photos yet</div>
        )}
      </div>
    </div>
  )
}
