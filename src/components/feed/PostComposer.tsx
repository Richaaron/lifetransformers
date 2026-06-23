"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Image as ImageIcon, Video, X, Loader2, Sparkles, Hash, AtSign } from "lucide-react"
import { uploadMediaAction } from "@/lib/actions/media"
import { formatFileSize } from "@/lib/utils/file-upload"
import { getInitials } from "@/lib/utils"
import { tokeniseContent, extractHashtags, extractMentions } from "@/lib/utils/content-parser"
import { createClient } from "@/lib/supabase/client"

interface PostComposerProps {
  currentUser: {
    id: string
    avatar_url: string | null
    display_name: string
  }
  groupId?: string
}

const INSPIRING_PLACEHOLDERS = [
  "What is on your heart today?",
  "Share an encouraging word with the community…",
  "What has God been teaching you lately?",
  "Share a moment of gratitude…",
  "Inspire someone today — what's your reflection?",
]

interface MentionSuggestion {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
}

export function PostComposer({ currentUser, groupId }: PostComposerProps) {
  const [content, setContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [fileType, setFileType] = useState<"image" | "video" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Mention autocomplete
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [mentionSuggestions, setMentionSuggestions] = useState<MentionSuggestion[]>([])
  const [mentionLoading, setMentionLoading] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const placeholder = INSPIRING_PLACEHOLDERS[Math.floor(Math.random() * INSPIRING_PLACEHOLDERS.length)]

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 280)}px`
  }, [])

  // Detect @mention trigger in textarea
  const detectMentionTrigger = useCallback((text: string, cursorPos: number) => {
    const before = text.slice(0, cursorPos)
    const mentionMatch = before.match(/@([a-zA-Z0-9_]*)$/)
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1])
    } else {
      setMentionQuery(null)
      setMentionSuggestions([])
    }
  }, [])

  // Fetch mention suggestions from Supabase
  useEffect(() => {
    if (mentionQuery === null) return
    const timeout = setTimeout(async () => {
      setMentionLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .ilike("username", `${mentionQuery}%`)
        .neq("id", currentUser.id)
        .limit(5)
      setMentionSuggestions(data || [])
      setMentionLoading(false)
      setActiveSuggestion(0)
    }, 150)
    return () => clearTimeout(timeout)
  }, [mentionQuery, currentUser.id])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setContent(val)
    autoResize()
    detectMentionTrigger(val, e.target.selectionStart ?? val.length)
  }

  const insertMention = (username: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const cursorPos = textarea.selectionStart ?? content.length
    const before = content.slice(0, cursorPos)
    const after = content.slice(cursorPos)
    // Replace the partial @query with the full @username + space
    const newBefore = before.replace(/@([a-zA-Z0-9_]*)$/, `@${username} `)
    const newContent = newBefore + after
    setContent(newContent)
    setMentionQuery(null)
    setMentionSuggestions([])
    // Restore focus and set cursor after inserted text
    setTimeout(() => {
      textarea.focus()
      const newPos = newBefore.length
      textarea.setSelectionRange(newPos, newPos)
      autoResize()
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveSuggestion(i => Math.min(i + 1, mentionSuggestions.length - 1))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveSuggestion(i => Math.max(i - 1, 0))
        return
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault()
        insertMention(mentionSuggestions[activeSuggestion].username)
        return
      }
      if (e.key === "Escape") {
        setMentionQuery(null)
        setMentionSuggestions([])
        return
      }
    }
    // Cmd/Ctrl+Enter submits
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit()
    }
  }

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
          hashtags: extractHashtags(textContent),
          mentions: extractMentions(textContent),
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
    } catch {
      setError("Failed to create post")
    }
    setIsSubmitting(false)
  }

  // Render highlighted preview layer (underneath transparent textarea)
  const renderHighlighted = () => {
    const tokens = tokeniseContent(content)
    return tokens.map((token, i) => {
      if (token.type === "hashtag") {
        return <mark key={i} className="bg-brand-500/20 text-brand-400 rounded px-0.5 not-italic">{token.value}</mark>
      }
      if (token.type === "mention") {
        return <mark key={i} className="bg-purple-500/20 text-purple-400 rounded px-0.5 not-italic">{token.value}</mark>
      }
      return <span key={i} className="text-transparent">{token.value}</span>
    })
  }

  const charCount = content.length
  const MAX_CHARS = 1000

  return (
    <div
      className="relative rounded-2xl overflow-visible transition-all duration-300"
      style={{
        background: "linear-gradient(145deg, rgba(16,14,28,0.85) 0%, rgba(10,10,20,0.75) 100%)",
        backdropFilter: "blur(24px)",
        border: isFocused ? "1px solid rgba(234,179,8,0.25)" : "1px solid rgba(255,255,255,0.07)",
        boxShadow: isFocused
          ? "0 0 0 1px rgba(234,179,8,0.1), 0 8px 40px rgba(234,179,8,0.08)"
          : "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {isFocused && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
      )}

      <div className="p-5">
        <div className="flex gap-3.5">
          <Avatar className="w-11 h-11 mt-0.5 shrink-0 border-2 border-brand-500/25 shadow-[0_0_12px_rgba(234,179,8,0.15)]">
            <AvatarImage src={currentUser.avatar_url || ""} />
            <AvatarFallback className="bg-surface-700 text-brand-400 font-bold text-sm">
              {getInitials(currentUser.display_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-3">
            {/* Rich text input container */}
            <div className="relative min-h-[52px]">
              {/* Highlight layer — rendered under the textarea */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pt-2.5 pb-1 px-0 text-[15px] leading-relaxed pointer-events-none whitespace-pre-wrap break-words"
                style={{ fontFamily: "inherit" }}
              >
                {renderHighlighted()}
                {/* Invisible trailing char to keep height correct */}
                <span className="text-transparent">⠀</span>
              </div>

              {/* Actual transparent textarea */}
              <textarea
                ref={textareaRef}
                placeholder={placeholder}
                className="relative w-full resize-none bg-transparent px-0 pt-2.5 pb-1 text-[15px] text-white/90 placeholder:text-surface-500 leading-relaxed focus:outline-none caret-brand-400 overflow-hidden"
                style={{ minHeight: "52px", fontFamily: "inherit", caretColor: "#EAB308" }}
                value={content}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false)
                  setTimeout(() => setMentionSuggestions([]), 200)
                }}
                disabled={isSubmitting}
                maxLength={MAX_CHARS}
              />
            </div>

            {/* @Mention autocomplete dropdown */}
            {mentionSuggestions.length > 0 && (
              <div
                className="absolute z-50 w-72 rounded-xl overflow-hidden shadow-2xl border border-white/10 animate-fade-up"
                style={{
                  background: "rgba(14,12,26,0.96)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
                }}
              >
                {mentionSuggestions.map((user, i) => (
                  <button
                    key={user.id}
                    onMouseDown={(e) => { e.preventDefault(); insertMention(user.username) }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      i === activeSuggestion ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"
                    }`}
                  >
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarImage src={user.avatar_url || ""} />
                      <AvatarFallback className="text-xs">{getInitials(user.display_name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.display_name}</p>
                      <p className="text-xs text-surface-400 truncate">@{user.username}</p>
                    </div>
                  </button>
                ))}
                {mentionLoading && (
                  <div className="flex items-center justify-center p-3">
                    <Loader2 className="w-4 h-4 animate-spin text-surface-400" />
                  </div>
                )}
              </div>
            )}

            {previewUrl && (
              <div className="relative rounded-xl overflow-hidden border border-surface-700/60 shadow-md">
                {fileType === "video" ? (
                  <video src={previewUrl} className="w-full max-h-60 object-cover" controls />
                ) : (
                  <img src={previewUrl} alt="Preview" className="w-full max-h-60 object-cover" />
                )}
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center backdrop-blur-sm transition-all press-effect"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
                <div className="absolute bottom-2 left-2.5 px-2.5 py-1 bg-black/65 rounded-full text-[11px] text-white/80 backdrop-blur-sm font-medium">
                  {formatFileSize(selectedFile!.size)}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
              <div className="flex items-center gap-0.5">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileSelect(e, "image")} className="hidden" />
                <input ref={videoInputRef} type="file" accept="video/*" onChange={(e) => handleFileSelect(e, "video")} className="hidden" />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-surface-400 hover:text-brand-400 hover:bg-brand-500/10 text-sm font-medium transition-all duration-200 press-effect disabled:opacity-40"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-surface-400 hover:text-brand-400 hover:bg-brand-500/10 text-sm font-medium transition-all duration-200 press-effect disabled:opacity-40"
                >
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline">Video</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setContent(c => c + "#"); textareaRef.current?.focus() }}
                  disabled={isSubmitting}
                  title="Add hashtag"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-surface-400 hover:text-brand-400 hover:bg-brand-500/10 text-sm font-medium transition-all duration-200 press-effect disabled:opacity-40"
                >
                  <Hash className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => { setContent(c => c + "@"); textareaRef.current?.focus() }}
                  disabled={isSubmitting}
                  title="Mention someone"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-surface-400 hover:text-purple-400 hover:bg-purple-500/10 text-sm font-medium transition-all duration-200 press-effect disabled:opacity-40"
                >
                  <AtSign className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {isFocused && (
                  <span className={`text-xs tabular-nums ${charCount > MAX_CHARS * 0.9 ? "text-red-400" : "text-surface-600"}`}>
                    {charCount}/{MAX_CHARS}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={(!content.trim() && !selectedFile) || isSubmitting || charCount > MAX_CHARS}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-500 to-amber-500 text-surface-950 font-bold text-sm shadow-[0_4px_16px_rgba(234,179,8,0.3)] hover:shadow-[0_4px_24px_rgba(234,179,8,0.5)] hover:from-brand-400 hover:to-amber-400 transition-all duration-200 press-effect disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Share
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-400 mt-1 animate-fade-in">{error}</p>}
            {success && <p className="text-xs text-emerald-400 mt-1 animate-fade-in">✨ Posted successfully!</p>}
            {isFocused && !mentionSuggestions.length && (
              <p className="text-[11px] text-surface-600">
                Use <span className="text-brand-500">#hashtags</span> and{" "}
                <span className="text-purple-400">@mentions</span> · Ctrl+Enter to post
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
