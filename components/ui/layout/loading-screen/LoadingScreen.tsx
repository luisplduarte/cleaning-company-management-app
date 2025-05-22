import { ReactNode } from "react"
import { Spinner } from "@/components/ui/elements/spinner/Spinner"

interface LoadingScreenProps {
  children?: ReactNode
  fullScreen?: boolean
  className?: string
}

export function LoadingScreen({ children, fullScreen = true, className = "" }: LoadingScreenProps) {
  const fullScreenClass = fullScreen ? "min-h-screen" : "min-h-[400px]"
  
  return (
    <div className={`grid ${fullScreenClass} place-items-center bg-white ${className}`}>
      {children || <Spinner size="lg" />}
    </div>
  )
}
