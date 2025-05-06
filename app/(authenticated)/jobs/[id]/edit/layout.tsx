import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Edit Job",
  description: "Modify an existing cleaning service job."
}

export default function EditJobLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
