import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  iconMap,
} from './toast'
import { useToastStore } from '@/hooks/use-toast'

export function Toaster() {
  const { toasts } = useToastStore()
  return (
    <ToastProvider>
      {toasts.map((t) => (
        <Toast key={t.id} variant={t.variant} duration={t.duration ?? 4000}>
          {iconMap[t.variant ?? 'default']}
          <div className="flex-1 space-y-0.5">
            <ToastTitle>{t.title}</ToastTitle>
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
