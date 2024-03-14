<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, watch, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { useEqptStore } from '@/stores/modules/eqpt'
import { usePageVisibility } from '@/utils/composables/usePageVisibility'
import { SubName, pubSubUtil } from './utils/pub-sub'
import { getToken } from './utils/auth'
import { token2Disposable } from './api/user'
import { useUserStore } from './stores/modules/user'
import { useModalStore } from '@/stores/modules/modal'
import dayjs from 'dayjs'

const store = useAppStore()
const { isPageHidden, visibilityChange } = usePageVisibility()

function pageChange(e) {
  if (isPageHidden() || e.hidden || document.visibilityState === 'hidden') {
    console.log('hidden')
    store.togglePageShow(false)
    navigator.serviceWorker?.ready.then(registration => {
      if (registration) {
        registration?.active?.postMessage({
          type: 'visibilityChange',
          visible: false
        })
      }
    })
  } else {
    console.log('not hidden')
    store.togglePageShow(true)
    navigator.serviceWorker?.ready.then(registration => {
      if (registration) {
        registration?.active?.postMessage({
          type: 'visibilityChange',
          visible: true
        })
      }
    })
  }
}

let subOpenPhantomWithUrlKey, subOpenOkxWithUrlKey, disposePageShow, subSyncKey, watchModalVisible
let lastSyncTime
onBeforeMount(() => {
  useUserStore().register()
  useEqptStore().register()
  document.addEventListener(visibilityChange, pageChange, false)
  subOpenPhantomWithUrlKey = pubSubUtil.on(SubName.OpenPhantomWithUrl, async () => {
    const openUrl = await getOpenUrl()
    const encodedUrl =
      'https://phantom.app/ul/browse/' +
      encodeURIComponent(openUrl) +
      '?ref=' +
      encodeURIComponent(location.href)
    window.location.href = encodedUrl
  })
  subOpenOkxWithUrlKey = pubSubUtil.on(SubName.OpenOkxWithUrl, async () => {
    const openUrl = await getOpenUrl()
    const encodedUrl =
      'https://www.okx.com/download?deeplink=' +
      encodeURIComponent('okx://wallet/dapp/url?dappUrl=' + encodeURIComponent(openUrl))
    window.location.href = encodedUrl
  })
  disposePageShow = watch(
    () => useAppStore().pageShow,
    pageShow => {
      if (pageShow) {
        pubSubUtil.emit(SubName.Sync, { force: false })
      }
    }
  )
  subSyncKey = pubSubUtil.on(SubName.Sync, params => {
    const token = getToken()
    if (token == null) {
      return
    }
    if (
      params?.force ||
      lastSyncTime == null ||
      dayjs().isAfter(dayjs(lastSyncTime).add(10, 'second'))
    ) {
      lastSyncTime = dayjs().valueOf()
      useUserStore().getUserInfo()
      useEqptStore().sync()
    }
  })
})

onMounted(() => {
  watchModalVisible = watch(
    () => useModalStore().visible,
    () => {
      console.log('watchModalVisible:', useModalStore().visible)
      if (useModalStore().visible) {
        ;(document as any).body.parentNode.style.overflow = 'hidden'
      } else {
        ;(document as any).body.parentNode.style.overflow = ''
      }
    },
    { immediate: true }
  )

  useModalStore().init()
})

onBeforeUnmount(() => {
  useUserStore().dispose()
  useEqptStore().dispose()
  document.removeEventListener(visibilityChange, pageChange, false)
  subOpenPhantomWithUrlKey && pubSubUtil.off(subOpenPhantomWithUrlKey)
  subOpenOkxWithUrlKey && pubSubUtil.off(subOpenOkxWithUrlKey)
  disposePageShow && disposePageShow()
  subSyncKey && pubSubUtil.off(subSyncKey)
})

onUnmounted(() => {
  watchModalVisible && watchModalVisible()
  useModalStore().dispose()
})

async function getOpenUrl() {
  const token = getToken()
  const url = new URL(location.href)
  if (token != null) {
    const resp = await token2Disposable()
    url.searchParams.append('d', resp.disposable_token)
  }
  return Promise.resolve(url.href)
}
</script>
