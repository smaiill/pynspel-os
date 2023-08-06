import { Toast, toast } from 'react-hot-toast'
import { cva } from '../../../../../styled-system/css'
import { AlertCircle } from 'lucide-react'
import { PxToast, PxToastError, PxToastSuccess, ToastVisual } from './PxToast'

type ToastOptions = Partial<
  Pick<
    Toast,
    | 'style'
    | 'icon'
    | 'className'
    | 'id'
    | 'position'
    | 'duration'
    | 'ariaProps'
    | 'iconTheme'
  >
>

export const pxToast = (
  type: ToastVisual,
  content: string,
  options?: ToastOptions
) => {
  switch (type) {
    case 'error':
      toast.custom(<PxToastError content={content} />, {
        duration: 5000,
        ...options,
      })
      break
    case 'success':
      toast.custom(<PxToastSuccess content={content} />, {
        duration: 5000,
        ...options,
      })
      break
    default:
      break
  }
}
