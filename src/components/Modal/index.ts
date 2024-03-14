import { h, render as VueRender, cloneVNode, createVNode } from 'vue'
import ModalComponent from './index.vue'

const destroyFns: Array<Function> = []

const openCommonModal = (config: any, slots: any) => {
  let vm
  const container = document.createElement('div')
  const currentConfig = {
    ...config,
    show: true,
    'onUpdate:show': newVal => {
      currentConfig.show = newVal
      VueRender(cloneVNode(vm, { ...currentConfig }), container)
    },
    onConfirm: () => {
      config.onConfirm && config.onConfirm()
      currentConfig.show = false
      VueRender(cloneVNode(vm, { ...currentConfig }), container)
    },
    onClosed: () => {
      hideModal()
    }
  }
  vm = createVNode(
    h(ModalComponent, currentConfig, {
      ...slots
    })
  )

  const showModal = () => {
    document.body.appendChild(container)
    VueRender(vm, container)
  }
  showModal()

  const hideModal = () => {
    VueRender(null, container)
    document.body.removeChild(container)
    vm = null
  }

  const closeModal = () => {
    if (currentConfig.show && vm) {
      currentConfig.show = false
      VueRender(cloneVNode(vm, { ...currentConfig }), container)
    }
  }

  destroyFns.push(closeModal)

  return {
    close: closeModal
  }
}

function closeAllModal() {
  while (destroyFns.length) {
    const close = destroyFns.pop()
    if (close) {
      close()
    }
  }
}

export const commonModal = {
  open: function (config: any, slots: any = null) {
    return openCommonModal(config, slots)
  },
  closeAll: function () {
    closeAllModal()
  }
}
