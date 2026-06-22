import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Pending Approval - Life Transformers",
}

export default function PendingPage() {
  return (
    <Card className="w-full text-center">
      <CardHeader className="items-center">
        <Image
          src="/logo.png"
          alt="Life Transformers Logo"
          width={100}
          height={100}
          className="mb-4 rounded-full"
          priority
        />
        <CardTitle className="text-3xl text-brand-500 mb-2">Request Received</CardTitle>
        <CardDescription className="text-lg">
          Your account is pending admin approval.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-surface-800 p-6 rounded-lg text-surface-200">
          <p>
            Because Life Transformers is a closed, private network, all new accounts
            must be verified by an administrator before you can access the feed,
            groups, or member directory.
          </p>
          <p className="mt-4">
            You will be notified once your account has been approved.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/login">Return to Sign In</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
