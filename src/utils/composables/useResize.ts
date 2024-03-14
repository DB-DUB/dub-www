import { useAppStore } from '@/stores/modules/app'
import { DeviceEnums } from '@/api/model/enums'

const WIDTH = 992 // 576

export function useResize() {
  const store = useAppStore()

  function resizeHandler() {
    if (!document.hidden) {
      const isMobile = getIsMobile()
      store.toggleDevice(isMobile ? DeviceEnums.Mobile : DeviceEnums.Desktop)
    }
  }

  function getIsMobile() {
    const rect = document.body.getBoundingClientRect()
    const isMobile = rect.width - 1 < WIDTH
    if (isMobile) {
      store.closeSideBar()
    }
    return isMobile
  }

  return { resizeHandler, getIsMobile }
}
