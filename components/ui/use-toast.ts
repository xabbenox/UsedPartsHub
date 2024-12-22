import { toast, type ToastT } from 'sonner'

type ToastOptions = Partial<ToastT> & { type?: 'success' | 'error' | 'warning' | 'info' };

export const useToast = () => {
  return {
    toast: (message: string, options?: ToastOptions) => {
      if (options?.type) {
        switch (options.type) {
          case 'success':
            return toast.success(message, options);
          case 'error':
            return toast.error(message, options);
          case 'warning':
            return toast.warning(message, options);
          case 'info':
            return toast.info(message, options);
        }
      }
      return toast(message, options);
    }
  }
}

