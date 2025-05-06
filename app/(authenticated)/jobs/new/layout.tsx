import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Job",
  description: "Create a new cleaning service job."
}

export default function NewJobLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
