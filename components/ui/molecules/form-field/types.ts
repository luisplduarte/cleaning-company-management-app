export interface FormFieldProps {
  id: string
  label?: string
  error?: string
  required?: boolean
  description?: string
  className?: string
  children: React.ReactNode
}

export interface FormLabelProps {
  id: string
  label: string
  required?: boolean
  className?: string
}

export interface FormErrorProps {
  error?: string
  className?: string
}

export interface FormDescriptionProps {
  description?: string
  className?: string
}
