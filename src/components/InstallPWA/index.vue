<template>
  <div
    v-show="show"
    :class="[
      'install-pwa-wrap',
      { 'ios-install-pwa-wrap': uiType === 'ios', 'android-install-pwa-wrap': uiType === 'android' }
    ]"
  >
    <!-- iOS PWA install introduction -->
    <template v-if="uiType === 'ios'">
      <div class="logo">DUB</div>
      <div class="desc">
        Add the prank App to your desktop to receive notifications whenever your friends get pranked.
      </div>
      <div class="steps ios-steps">
        <div class="step step1">
          <span>
            1. Tap on the<br />
            share button<br />
            below the Safari
          </span>
          <img
            src="@/assets/mobile-install/icon-install-pwa-safari1.png"
            width="94"
            height="94"
            alt=""
          />
        </div>
        <div class="step step2">
          2.Select
          <img
            src="@/assets/mobile-install/icon-install-pwa-safari2.png"
            width="199"
            height="94"
            alt=""
          />
        </div>
      </div>
      <img class="bottom-arrow" src="@/assets/mobile-install/arrow-white.svg" />
      <div class="ios-go-web" @click="useWeb">Stay on website</div>
    </template>
    <!-- Android PWA install introduction -->
    <template v-else>
      <div class="logo">DUB</div>
      <div class="desc">
        Add the prank App to your desktop to receive notifications whenever your friends get pranked.
      </div>
      <div class="steps android-steps">
        <div class="step">
          1.Tap on
          <div class="step-icon step1-icon">
            <img
              src="@/assets/mobile-install/android-install-icon1.svg"
              width="4"
              height="20"
              alt=""
              class="icon"
            />
          </div>
        </div>
        <div class="step">
          2.Select
          <div class="step-icon step2-icon">
            Install App
          </div>
        </div>
        <div class="btn-wrap">
          <Button title="Stay on website" theme="white" @click="useWeb" />
          <Button
            v-show="uiType === 'install'"
            title="Install Now"
            theme="white"
            @click="handleClick"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Button/index.vue'
import { getDeviceInfo, getPWADisplayMode } from '@/utils/common'
import { getUseWebFlag, setUseWebFlag } from '@/utils/auth'

interface Props {
  show: boolean
}
const uiType = ref('')
const deviceInfo = getDeviceInfo()
const displayMode = getPWADisplayMode()
const useWebFlag = getUseWebFlag()
const props = defineProps<Props>()
const emits = defineEmits(['update:show'])

function init() {
  // mobile browser(and not PWA)  && has not choose use web button
  if (displayMode === 'browser' && useWebFlag !== '1') {
    if (deviceInfo.isIOS) {
      uiType.value = 'ios'
    } else if (deviceInfo.isAndroid) {
      uiType.value = 'android'
    } else {
      emits('update:show', false)
    }
  } else {
    emits('update:show', false)
  }
}
init()

let deferredPrompt
window.addEventListener('beforeinstallprompt', event => {
  // Prevent the mini-infobar from appearing on mobile.
  event.preventDefault()
  console.log('👍', 'beforeinstallprompt', event)
  // Stash the event so it can be triggered later.
  deferredPrompt = event
  if (deviceInfo.isAndroid && useWebFlag !== '1') {
    uiType.value = 'install'
  }
})
window.addEventListener('appinstalled', event => {
  console.log('👍', 'appinstalled', event)
  deferredPrompt = null
})
const handleClick = async () => {
  console.log('👍', 'butInstall-clicked')
  const promptEvent = deferredPrompt
  if (!promptEvent) {
    return
  }
  promptEvent.prompt()
  await promptEvent.userChoice
  deferredPrompt = null
}

function useWeb() {
  emits('update:show', false)
  // user do not want to install PWA, not ask again
  setUseWebFlag(1)
}
</script>

<style lang="less" scoped>
.install-pwa-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  background-color: #000;
  z-index: 100;
  padding: 3rem;
  .ios-go-web {
    position: absolute;
    top: 1.7rem;
    right: 2.2rem;
    font-size: 1.4rem;
    line-height: 2rem;
    border-bottom: 1px solid #fff;
    cursor: pointer;
  }
  .bottom-arrow {
    width: 2.9rem;
    height: 3.1rem;
    position: absolute;
    bottom: 1.6rem;
    transform: translateX(-50%);
    left: 50%;
  }
  .logo {
    font-family: PixeloidSans-Bold;
    font-size: 4rem;
    line-height: 4rem;
    margin-top: 9.8rem;
    text-align: center;
  }
  .desc {
    font-size: 2rem;
    line-height: 2.8rem;
    color: #fff;
    font-weight: 600;
    margin-top: 11.7rem;
  }
  .steps {
    margin-top: 2.6rem;
    .step {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 1.8rem;
      line-height: 2.6rem;
    }
    .step + .step {
      margin-top: 1.4rem;
    }
    .step-icon {
      height: 4rem;
      line-height: 4rem;
      display: flex;
      align-items: center;
      margin-left: 2rem;
      color: #323232;
      background-color: #fff;
      border-radius: 0.8rem;
    }
  }
  .ios-steps {
    margin-top: 1.6rem;
    .step1 {
      display: flex;
      align-items: center;
      img {
        margin-left: 0.7rem;
        width: 9rem;
        height: 9rem;
      }
    }
    .step + .step2 {
      align-items: flex-start;
      margin-top: 3.2rem;
      img {
        margin-left: 1.5rem;
        width: 19.9rem;
        height: 9.4rem;
      }
    }
  }
  .android-steps {
    .step1-icon {
      width: 4rem;
      height: 4rem;
      justify-content: center;
      img {
        width: 0.4rem;
        height: 2rem;
      }
    }
    .step2-icon {
      padding: 0 1.4rem;
    }
  }
  .btn-wrap {
    position: fixed;
    right: 3rem;
    left: 3rem;
    height: 4.6rem;
    bottom: 5.1rem;
    bottom: calc(5.1rem + constant(safe-area-inset-bottom));
    bottom: calc(5.1rem + env(safe-area-inset-bottom));
    display: flex;
    .button-container {
      flex: 1;
    }
    :deep(.button-container.large .title) {
      font-family: PixeloidSans;
      font-size: 1.4rem;
    }
    .button-container + .button-container {
      margin-left: 1rem;
    }
  }
}
</style>
