import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TripProvider } from "@/contexts/trip-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travel Companion App",
  description: "Plan your perfect trip with budget tracking",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TripProvider>{children}</TripProvider>
      </body>
    </html>
  )
}
