import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  id: string
  label?: string
  error?: string
  className?: string
  children: ReactNode
  description?: string
  required?: boolean
}

export function FormField({
  id,
  label,
  error,
  className,
  children,
  description,
  required,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="mt-2">{children}</div>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600 animate-in fade-in slide-in-from-bottom-1 duration-200">
          {error}
        </p>
      )}
    </div>
  )
}
