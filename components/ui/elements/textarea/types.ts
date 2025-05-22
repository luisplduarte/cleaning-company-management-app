import { TextareaHTMLAttributes } from "react"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  fullWidth?: boolean
  label?: string
  helperText?: string
  rows?: number
  maxLength?: number
  showCharacterCount?: boolean
}
