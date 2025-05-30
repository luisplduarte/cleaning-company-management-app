import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  if (!date) return "-"
  
  const d = typeof date === "string" ? new Date(date) : date
  if (isNaN(d.getTime())) return "-"

  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function generatePagination(currentPage: number, totalPages: number) {
  // If total pages is less than 7, show all pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // If current page is among the first 3 pages
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages - 1, totalPages]
  }

  // If current page is among the last 3 pages
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  }

  // If current page is somewhere in the middle
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout

  return ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

export const formatPaymentStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'WAITING_PAYMENT': 'Waiting payment',
    'ISSUED': 'Issued',
    'COMPLETED': 'Completed'
  }
  return statusMap[status] || status
}
