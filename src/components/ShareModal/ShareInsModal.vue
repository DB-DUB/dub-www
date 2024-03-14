<template>
  <Modal
    :show="show"
    :title="title"
    :wrapper-class="['share-ins-modal-wrap']"
    @update:show="$emit('update:show', $event)"
  >
    <template #body>
      <div class="share-ins-img-wrapper" :style="wrapperStyle">
        <div class="share-ins-img-box" :style="boxStyle">
          <div ref="screenshotArea" class="share-ins-img-container">
            <img ref="bgRef" class="share-ins-img" src="@/assets/share-ins-bg@2x.jpg" />
            <div class="share-ins-content">
              {{ content }}
            </div>
            <img v-show="qrcodeDataUrl" class="qrcode-img" :src="qrcodeDataUrl" />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="common-modal-footer-inner">
        <Button title="Share to Instagram" @click="handleShareOrDownload">
          <template #icon>
            <img class="button-icon" src="@/assets/third-logo/ins-logo.png" />
          </template>
        </Button>
        <iframe style="display: none;" :src="iframeUrl" ref="shareIframeRef"></iframe>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { watch, ref, onMounted, computed } from 'vue'
import domtoimage from 'dom-to-image'
import { AraleQRCode } from '@/utils/arale-qrcode.js'
import Modal from '@/components/Modal/index.vue'
import Button from '@/components/Button/index.vue'
import ToastManager from '@/components/Toast/ToastManager'
import { getDeviceInfo } from '@/utils/common'
import { dataURItoFile } from '@/utils/file-helper'

interface Props {
  show: boolean
  title?: string
  content?: string
  url?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: '',
  url: ''
})

const qrcodeDataUrl = ref('')
watch(
  () => props.url,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      const qrcode = new AraleQRCode({
        render: 'canvas',
        correctLevel: 0,
        text: newVal,
        background: 'transparent',
        foreground: '#fff',
        size: 240
      })
      qrcodeDataUrl.value = qrcode.toDataURL()
      loadInitPromise = new Promise((resolve, reject) => {
        bgLoadInit.then(() => {
          // on iOS and MAC, domtoimage show blank image on first render
          if (deviceInfo.isApple) {
            domtoimage
              .toJpeg(screenshotArea.value, {
                quality: 0.8,
                width: 670,
                height: 684
              })
              .then(function () {
                domtoimage
                  .toJpeg(screenshotArea.value, {
                    quality: 0.8,
                    width: 670,
                    height: 684
                  })
                  .then(function (dataUrl) {
                    resultImgUrl.value = dataUrl
                    coverFile = dataURItoFile(dataUrl, 'jpeg')
                    resolve()
                  })
                  .catch(function (error) {
                    console.error('domtoimage error', error)
                    reject(error)
                  })
                // resultImgUrl.value = dataUrl
                // coverFile = dataURItoFile(dataUrl, 'jpeg')
                // console.log('domtoimage success')
                // resolve()
              })
              .catch(function (error) {
                console.error('domtoimage error', error)
                reject(error)
              })
          } else {
            // on Android and Windows only need one render
            domtoimage
              .toJpeg(screenshotArea.value, {
                quality: 0.8,
                width: 670,
                height: 684
              })
              .then(function (dataUrl) {
                resultImgUrl.value = dataUrl
                coverFile = dataURItoFile(dataUrl, 'jpeg')
                resolve()
              })
              .catch(function (error) {
                console.error('domtoimage error', error)
                reject(error)
              })
          }
        })
      })
    }
  },
  {
    immediate: true
  }
)

const wrapperStyle = computed(() => {
  return {
    width: Math.round(fontSize.value * 33.5) + 'px',
    height: Math.round(fontSize.value * 34.2) + 'px',
    marginLeft: '-6px'
  }
})

const boxStyle = computed(() => {
  return {
    transform: `scale(${fontSize.value / 20})`
  }
})

const emit = defineEmits(['shared', 'update:show'])
const deviceInfo = getDeviceInfo()
const screenshotArea = ref()
const shareIframeRef = ref()
const resultImgUrl = ref('')
const bgRef = ref()
let coverFile = null
let loadInitPromise = null
let bgLoadInit = null
const iframeUrl = ref(
  URL.createObjectURL(new Blob([`<!DOCTYPE html><html>`], { type: 'text/html' }))
)
const isShare = (deviceInfo.isAndroid && navigator.canShare) || deviceInfo.isIOS

function handleShareOrDownload() {
  if (isShare) {
    share()
  } else {
    download()
  }
}

function download() {
  loadInitPromise.then(() => {
    // When user on PC click Share Ins button, just download the image
    const link = document.createElement('a')
    link.href = resultImgUrl.value
    link.download = 'image.png'
    link.click()
    // Android and don't support share function, and not in PWA, should show the install PWA prompt modal
    if (deviceInfo.isAndroid && deviceInfo.isMobilePWAInstall) {
      emit('shared')
    }
  })
}

function share() {
  loadInitPromise
    .then(async () => {
      if (coverFile) {
        if (!navigator.canShare) {
          console.log('navigator not support share')
          return
        }
        const files = [coverFile]
        if (navigator.canShare({ files })) {
          try {
            await shareIframeRef.value?.contentWindow.navigator.share({
              files
            })
            if (deviceInfo.isMobilePWAInstall) {
              emit('shared')
            }
            shareIframeRef.value?.contentWindow.location.reload(true)
          } catch (error) {
            shareIframeRef.value?.contentWindow.location.reload(true)
            console.log('navigator share error:', error)
          }
        } else {
          console.log('navigator not support share files')
          ToastManager().showToast(`Your system doesn't support sharing these files.`, 'error')
        }
      }
    })
    .catch(e => {
      console.log('loadInitPromise error', e)
    })
}
onMounted(() => {
  bgLoadInit = new Promise((resolve, reject) => {
    bgRef.value.onload = function () {
      resolve()
    }
    bgRef.value.onerror = function (e) {
      reject(e)
    }
  })
})

function getFontSize() {
  const windowW = document.documentElement.clientWidth
  return windowW > 768 ? 20 : (windowW / 375) * 10
}
const fontSize = ref(getFontSize())
watch(
  () => props.show,
  () => {
    if (props.show) {
      fontSize.value = getFontSize()
    }
  }
)
</script>

<style lang="less">
.common-modal-wrap.share-ins-modal-wrap {
  .common-modal-wrapper {
    .common-modal-container {
      width: calc(33.5rem + 4px);
      max-width: unset;
      padding: 1.2rem 0 1.6rem;
      .common-modal-close {
        z-index: 10;
      }
      .common-modal-header {
        z-index: 9;
      }
      .common-modal-header {
        font-size: 2.1rem;
        text-align: center;
        position: absolute;
        width: 100%;
      }
      .common-modal-body {
        left: -1.2rem;
      }
      .common-modal-footer-inner {
        position: relative;
        padding: 0 1.6rem;
        .button-container {
          flex: 1;
          .button-icon {
            width: 2.4rem;
            height: 2.4rem;
            margin-right: 0.4rem;
          }
        }
      }
    }
  }
}
</style>

<style lang="less" scoped>
.share-ins-img-box {
  transform-origin: 0 0;
}
.share-ins-img-container {
  position: relative;
  width: 670px;
  height: 684px;
  .share-ins-img {
    position: relative;
    left: 0;
    width: 670px;
    height: 684px;
  }
  .share-ins-content {
    position: absolute;
    bottom: 40px;
    left: 48px;
    width: 362px;
    font-size: 28px;
    line-height: 40px;
    min-height: 160px;
    display: flex;
    align-items: center;
  }
  .qrcode-img {
    width: 160px;
    height: 160px;
    position: absolute;
    bottom: 40px;
    right: 48px;
  }
}
</style>
