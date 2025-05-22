import { InputHTMLAttributes } from "react"

export interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  label?: string
  helperText?: string
  minDate?: Date | string
  maxDate?: Date | string
  showTimeInput?: boolean
  fullWidth?: boolean
}

export interface CalendarProps {
  selectedDate?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  isOpen?: boolean
  onClose?: () => void
}
