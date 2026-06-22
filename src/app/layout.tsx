import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Life Transformers',
  description: 'A private social network for Life Transformers ministry',
  icons: {
    icon: '/logo.png',
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
        {children}
      </body>
    </html>
  )
}
