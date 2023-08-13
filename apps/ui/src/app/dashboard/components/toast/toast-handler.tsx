import { Toast, toast } from 'react-hot-toast'
import { PxToastError, PxToastSuccess, ToastVisual } from './PxToast'

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

const TOAST_DURATION = 3000

export const pxToast = (
  type: ToastVisual,
  content: string,
  options?: ToastOptions
) => {
  switch (type) {
    case 'error':
      toast.custom(<PxToastError content={content} />, {
        duration: TOAST_DURATION,
        ...options,
      })
      break
    case 'success':
      toast.custom(<PxToastSuccess content={content} />, {
        duration: TOAST_DURATION,
        ...options,
      })
      break
    default:
      break
  }
}
