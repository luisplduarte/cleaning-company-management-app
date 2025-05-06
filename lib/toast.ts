interface ToastProps {
  title: string
  message: string
  type: "success" | "error"
}

let toastCallback: ((props: ToastProps) => void) | null = null

export function setToastCallback(callback: (props: ToastProps) => void) {
  toastCallback = callback
}

export function toast(props: ToastProps) {
  if (toastCallback) {
    toastCallback(props)
  }
}
