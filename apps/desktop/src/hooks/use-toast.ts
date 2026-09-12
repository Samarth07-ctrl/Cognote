import * as React from 'react'
import type { ToastItem, ToastVariant } from '@/components/ui/toast'

interface ToastStore {
  toasts: ToastItem[]
  add: (toast: Omit<ToastItem, 'id'>) => void
  remove: (id: string) => void
}

// Simple singleton store — no Zustand overhead for toasts
let listeners: Array<(store: ToastStore) => void> = []
let store: ToastStore = {
  toasts: [],
  add: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    store = { ...store, toasts: [...store.toasts, { ...toast, id }] }
    listeners.forEach((l) => l(store))
    const duration = toast.duration ?? 4000
    if (duration > 0) {
      setTimeout(() => store.remove(id), duration)
    }
  },
  remove: (id) => {
    store = { ...store, toasts: store.toasts.filter((t) => t.id !== id) }
    listeners.forEach((l) => l(store))
  },
}

function useToastStore(): ToastStore {
  const [state, setState] = React.useState<ToastStore>(store)
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      listeners = listeners.filter((l) => l !== setState)
    }
  }, [])
  return state
}

function toast(title: string, options?: { description?: string; variant?: ToastVariant; duration?: number }) {
  store.add({ title, ...options })
}

toast.success = (title: string, description?: string) =>
  store.add({ title, description, variant: 'success' })

toast.error = (title: string, description?: string) =>
  store.add({ title, description, variant: 'error' })

toast.warning = (title: string, description?: string) =>
  store.add({ title, description, variant: 'warning' })

toast.info = (title: string, description?: string) =>
  store.add({ title, description, variant: 'info' })

export { useToastStore, toast }
