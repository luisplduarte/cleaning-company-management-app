import { Inter } from "next/font/google"
import { Metadata } from "next"
import "./globals.css"
import AuthProvider from "@/components/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Cleaning Company Management",
    template: "%s | Cleaning Company Management",
  },
  description: "Manage your cleaning company jobs, clients, and workers.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-blue-100 text-black antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <div id="modal-root" />
      </body>
    </html>
  )
}
