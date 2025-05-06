import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Jobs",
  description: "Manage cleaning service jobs, schedules, and assignments."
}

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
