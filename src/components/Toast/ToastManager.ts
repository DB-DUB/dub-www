import { createApp, h, ref } from 'vue'
import ToastComponent from './Toast.vue'

const toasts = ref<
  Array<{
    id: string
    message: string
    type: 'warn' | 'success' | 'error' | 'loading'
    duration?: number
  }>
>([])

const toastApp = ref<any>(null)

const ToastManager = () => {
  if (!toastApp.value) {
    const toastContainerStyle = {
      paddingTop: '10px',
      position: 'fixed',
      top: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: '999'
    }
    toastApp.value = createApp({
      render() {
        return h(
          'div',
          { class: 'toast-container', style: toastContainerStyle },
          this.toasts.map(toast => {
            return h(ToastComponent, {
              key: toast.id,
              message: toast.message,
              duration: toast.duration,
              type: toast.type,
              onClose: () => {
                closeToast(toast.id)
              }
            })
          })
        )
      },
      data() {
        return {
          toasts
        }
      }
    })
    const toastContainer = document.createElement('div')
    document.body.appendChild(toastContainer)
    toastApp.value.mount(toastContainer)
  }

  const showToast = (
    message: string,
    type: 'warn' | 'success' | 'error' | 'loading' = 'warn',
    duration: number = 3000
  ): void => {
    const newToast = { id: Date.now().toString(), message, duration, type }
    toasts.value.push(newToast)
  }

  const closeToast = (id: string): void => {
    toasts.value = toasts.value.filter(item => item.id !== id)
  }

  const closeAll = () => {
    toasts.value = []
  }

  return {
    showToast,
    closeAll
  }
}

export default ToastManager
