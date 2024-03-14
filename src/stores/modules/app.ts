import { defineStore } from 'pinia'
import store from '@/stores'
import { DeviceEnums } from '@/api/model/enums'

export const useAppStore = defineStore({
  id: 'app',
  state: () => {
    return {
      sidebarOpened: true,
      device: DeviceEnums.Desktop,
      badges: {},
      pageShow: true
    }
  },
  getters: {
    isMobile(): boolean {
      return this.device === DeviceEnums.Mobile
    }
  },
  persist: [
    {
      key: 'sidebarStatus',
      paths: ['sidebarOpened'],
      storage: sessionStorage
    }
  ],
  actions: {
    toggleDevice(device: DeviceEnums) {
      this.device = device
    },
    toggleSideBar() {
      this.sidebarOpened = !this.sidebarOpened
    },
    closeSideBar() {
      this.sidebarOpened = false
    },
    checkBadges(badges) {
      this.badges = badges
    },
    togglePageShow(show: boolean) {
      this.pageShow = show
    }
  }
})

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store)
}
