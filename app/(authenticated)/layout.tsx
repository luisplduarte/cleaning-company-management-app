import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your cleaning company services and operations.",
}

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
