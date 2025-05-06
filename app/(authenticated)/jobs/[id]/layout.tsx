import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Job Details",
  description: "View details of a cleaning service job."
}

export default function JobDetailsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
