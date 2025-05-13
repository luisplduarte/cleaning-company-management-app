import { Inter } from "next/font/google"
import { Metadata } from "next"
import AuthProvider from "@/components/AuthProvider"
import "@/app/globals.css"

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
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <div id="modal-root" />
      </body>
    </html>
  )
}
