import { Metadata } from "next"
import { SecuritySettings } from "@/components/settings/SecuritySettings"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Security Settings - Life Transformers",
}

export default function SecuritySettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/profile/edit" 
          className="p-2 rounded-full hover:bg-surface-800 transition-colors text-surface-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Security Settings</h1>
          <p className="text-surface-400 text-sm">Manage your account security and authentication methods.</p>
        </div>
      </div>

      <SecuritySettings />
    </div>
  )
}
