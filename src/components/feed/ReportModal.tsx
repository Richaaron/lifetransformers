"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createReport } from "@/lib/actions/reports"
import { Flag } from "lucide-react"
import { useState } from "react"

interface ReportModalProps {
  resourceType: "post" | "comment" | "message" | "profile"
  resourceId: string
  trigger?: React.ReactNode
}

export default function ReportModal({
  resourceType,
  resourceId,
  trigger,
}: ReportModalProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) return

    setIsSubmitting(true)
    try {
      await createReport({ resourceType, resourceId, reason, description })
      setOpen(false)
      setReason("")
      setDescription("")
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const reasons = [
    "Spam",
    "Inappropriate Content",
    "Harassment",
    "Fake Account",
    "Other",
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Flag className="w-4 h-4 mr-2" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-surface-900 border border-surface-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Report {resourceType}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-surface-400">Reason for reporting</p>
            <div className="grid grid-cols-2 gap-2">
              {reasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                    reason === r
                      ? "border-brand-500 bg-brand-500/10 text-brand-400"
                      : "border-surface-700 hover:border-surface-600"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-surface-400">Additional details (optional)</p>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more context about this report..."
              className="bg-surface-800 border-surface-700"
            />
          </div>
          <Button type="submit" disabled={!reason || isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
