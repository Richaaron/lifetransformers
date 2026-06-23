"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Image as ImageIcon, Video, X, Loader2 } from "lucide-react"
import { uploadMediaAction } from "@/lib/actions/media"
import { formatFileSize } from "@/lib/utils/file-upload"

interface PostComposerProps {
  currentUser: {
    id: string
    avatar_url: string | null
    display_name: string
  }
  groupId?: string
}

export function PostComposer({ currentUser, groupId }: PostComposerProps) {
  const [content, setContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [fileType, setFileType] = useState<"image" | "video" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError(`File must be less than ${type === "video" ? "50MB" : "10MB"}`)
      return
    }

    setSelectedFile(file)
    setFileType(type)
    setPreviewUrl(URL.createObjectURL(file))
    setError("")
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    setFileType(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  const handleSubmit = async () => {
    const textContent = content.trim()
    
    if (!textContent && !selectedFile) return

    setIsSubmitting(true)
    setError("")

    let mediaUrl = ""
    let mediaType = ""

    if (selectedFile) {
      const bucket = fileType === "video" ? "videos" : "posts"
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("bucket", bucket)
      formData.append("userId", currentUser.id)
      const { url, error: uploadError } = await uploadMediaAction(formData)
      
      if (uploadError) {
        setError("Failed to upload file: " + uploadError)
        setIsSubmitting(false)
        return
      }
      
      mediaUrl = url || ""
      mediaType = fileType || ""
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: textContent,
          mediaUrl,
          mediaType,
          groupId: groupId || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create post")
        setIsSubmitting(false)
        return
      }

      setContent("")
      removeFile()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
      window.location.reload()
    } catch (err) {
      setError("Failed to create post")
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="glass rounded-2xl p-5 shadow-lg border border-white/5 transition-all duration-300 focus-within:shadow-[0_0_30px_rgba(234,179,8,0.15)] focus-within:border-brand-500/40 hover-lift">
      <div className="flex gap-4">
        <Avatar className="w-12 h-12 mt-0.5 shrink-0 border border-surface-700 shadow-sm">
          <AvatarImage src={currentUser.avatar_url || ""} />
          <AvatarFallback>{currentUser.display_name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3 min-w-0">
          <Textarea
            placeholder="Share something with your network..."
            className="min-h-[60px] resize-none border-none bg-transparent px-0 py-2 focus-visible:ring-0 text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                <Video className="w-4 h-4" />
                <span className="hidden sm:inline">Video</span>
              </Button>
            </div>
            
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={(!content.trim() && !selectedFile) || isSubmitting}
              className="rounded-full px-8 h-10 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-surface-950 font-semibold shadow-[0_4px_12px_rgba(234,179,8,0.25)] hover:shadow-[0_4px_20px_rgba(234,179,8,0.4)] transition-all press-effect"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Post"
              )}
            </Button>
          </div>
          
          {error && (
            <p className="text-sm text-red-400 mt-2">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-400 mt-2">Post created!</p>
          )}
        </div>
      </div>
    </div>
  )
}
