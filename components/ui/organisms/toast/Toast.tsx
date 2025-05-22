"use client"

import { useEffect, useState } from "react"
import { setToastCallback } from "@/lib/toast"

interface ToastProps {
  title?: string
  type: "success" | "error"
  message: string
  onClose?: () => void
  duration?: number
}

function ToastComponent({ title, type, message, onClose, duration = 5000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 200)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transition-all duration-200 ease-in-out ${
        isLeaving ? 'translate-x-2 opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div
        className={`rounded-md p-4 shadow-lg ${
          type === "success"
            ? "bg-green-50 text-green-800"
            : "bg-red-50 text-red-800"
        }`}
        role="alert"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {type === "success" ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="ml-3">
            {title && <p className="text-sm font-medium">{title}</p>}
            <p className={`text-sm ${title ? 'mt-1' : 'font-medium'}`}>{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsLeaving(true)
                  setTimeout(() => {
                    setIsVisible(false)
                    onClose?.()
                  }, 200)
                }}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === "success"
                    ? "text-green-500 hover:bg-green-100 focus:ring-green-600"
                    : "text-red-500 hover:bg-red-100 focus:ring-red-600"
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    setToastCallback((props) => {
      setToasts((prev) => [...prev, props])
    })
  }, [])

  return (
    <>
      {toasts.map((props, index) => (
        <ToastComponent
          key={index}
          {...props}
          onClose={() => {
            setToasts((prev) => prev.filter((_, i) => i !== index))
          }}
        />
      ))}
    </>
  )
}

export { type ToastProps }
