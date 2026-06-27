import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import './globals.css'
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { AppShell } from "@/components/mobile/AppShell"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Life Transformers',
  description: 'A private social network for Life Transformers ministry',
  icons: {
    icon: '/logo.png',
  },
  manifest: '/manifest.json',
  themeColor: '#eab308',
  viewport: 'width=device-width, initial-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Life Transformers',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} bg-surface-950 text-white min-h-screen antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
