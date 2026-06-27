"use client"

import { useRef } from "react"

type Props = {
  onUpload: (url: string, publicId?: string) => void
  folder?: string
  buttonText?: string
}

export default function UploadWidget({ onUpload, folder = "profiles", buttonText = "Upload" }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const openFilePicker = () => inputRef.current?.click()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Request signature from server
    const signRes = await fetch("/api/cloudinary/sign")
    if (!signRes.ok) {
      console.error("Failed to get Cloudinary signature")
      return
    }
    const signJson = await signRes.json()
    const cloudName = signJson.cloud_name
    const apiKey = signJson.api_key
    const signature = signJson.signature
    const timestamp = signJson.timestamp
    const serverFolder = signJson.folder

    const targetFolder = folder || serverFolder

    const form = new FormData()
    form.append("file", file)
    form.append("api_key", apiKey)
    form.append("timestamp", String(timestamp))
    form.append("signature", signature)
    form.append("folder", targetFolder)
    form.append("public_id", `${Date.now()}`)

    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: form,
    })

    const json = await uploadRes.json()
    if (!uploadRes.ok) {
      console.error("Cloudinary upload failed", json)
      return
    }

    onUpload(json.secure_url, json.public_id)
  }

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <button type="button" onClick={openFilePicker} className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-800 hover:bg-surface-700">
        {buttonText}
      </button>
    </>
  )
}
