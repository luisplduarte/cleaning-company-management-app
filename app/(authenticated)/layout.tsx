import { Metadata } from "next"
import { Navbar } from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your cleaning company services and operations.",
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
