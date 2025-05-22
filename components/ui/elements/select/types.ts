export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  id: string
  options: SelectOption[]
  value?: string
  placeholder?: string
  error?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
  onChange?: (value: string) => void
}
