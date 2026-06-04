import { useRef, useState } from 'react'

export const useNotification = (timeout = 5000) => {
  const [message, setMessage] = useState(null)
  const timeoutRef = useRef(null)

  const notify = (text) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setMessage(text)
    timeoutRef.current = setTimeout(() => setMessage(null), timeout)
  }

  return { message, notify }
}
