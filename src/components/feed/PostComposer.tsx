"use client"

import { useState, useRef } from "react"
import { useActionState } from "react"
import { createPost } from "@/lib/actions/posts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Image as ImageIcon, Video, X, Loader2 } from "lucide-react"
import { uploadFile, formatFileSize } from "@/lib/utils/file-upload"
import { containsCurseWords } from "@/lib/utils/word-filter"
import { createClient } from "@/lib/supabase/client"
import type { ActionResult } from "@/lib/types"

const initialState: ActionResult = {
  error: "",
}

interface PostComposerProps {
  currentUser: {
    id: string
    avatar_url: string | null
    display_name: string
  }
  groupId?: string
}

export function PostComposer({ currentUser, groupId }: PostComposerProps) {
  const [state, formAction, isPending] = useActionState(createPost, initialState)
  const [content, setContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [fileType, setFileType] = useState<"image" | "video" | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`File must be less than ${type === "video" ? "50MB" : "10MB"}`)
      return
    }

    setSelectedFile(file)
    setFileType(type)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setFileType(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  const handleSubmit = async (formData: FormData) => {
    const textContent = content.trim()
    
    if (!textContent && !selectedFile) return

    const { hasCurse, filtered } = containsCurseWords(textContent)
    if (hasCurse) {
      setContent(filtered)
      alert("Your post contains inappropriate language. It has been filtered.")
      return
    }

    setUploading(true)
    let mediaUrl = ""
    let mediaType = ""

    if (selectedFile && currentUser.id) {
      const bucket = fileType === "video" ? "videos" : "posts"
      const { url, error } = await uploadFile(selectedFile, bucket, currentUser.id)
      
      if (error) {
        alert("Failed to upload file: " + error)
        setUploading(false)
        return
      }
      
      mediaUrl = url || ""
      mediaType = fileType || ""
    }

    setUploading(false)

    formData.set("content", textContent)
    formData.set("mediaUrl", mediaUrl)
    formData.set("mediaType", mediaType)
    if (groupId) formData.set("groupId", groupId)

    formAction(formData)
    setContent("")
    removeFile()
  }

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-xl p-4 transition-all focus-within:shadow-glow-gold/10 focus-within:border-brand-500/30">
      <form 
        action={handleSubmit}
        className="flex gap-4"
      >
        {groupId && <input type="hidden" name="groupId" value={groupId} />}
        
        <Avatar className="w-10 h-10 mt-1 shrink-0">
          <AvatarImage src={currentUser.avatar_url || ""} />
          <AvatarFallback>{currentUser.display_name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3 min-w-0">
          <Textarea
            name="content"
            placeholder="Share something with your network..."
            className="min-h-[60px] resize-none border-none bg-transparent px-0 py-2 focus-visible:ring-0 text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending || uploading}
          />

          {previewUrl && (
            <div className="relative rounded-lg overflow-hidden border border-surface-700">
              {fileType === "video" ? (
                <video 
                  src={previewUrl} 
                  className="w-full max-h-64 object-cover"
                  controls
                />
              ) : (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full max-h-64 object-cover"
                />
              )}
              <button
                type="button"
                onClick={removeFile}
                className="absolute top-2 right-2 p-1 bg-black/70 rounded-full hover:bg-black/90"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                {formatFileSize(selectedFile!.size)}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-surface-800">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, "image")}
                className="hidden"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleFileSelect(e, "video")}
                className="hidden"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-surface-400 hover:text-brand-500 gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Photo</span>
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="text-surface-400 hover:text-brand-500 gap-2"
                onClick={() => videoInputRef.current?.click()}
                disabled={uploading}
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Video</span>
              </Button>
            </div>
            
            <Button 
              type="submit" 
              disabled={(!content.trim() && !selectedFile) || isPending || uploading}
              className="rounded-full px-6"
            >
              {(isPending || uploading) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Post"
              )}
            </Button>
          </div>
          
          {state?.error && (
            <p className="text-sm text-destructive mt-2">{state.error}</p>
          )}
        </div>
      </form>
    </div>
  )
}
