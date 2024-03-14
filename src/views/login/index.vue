<template>
  <div class="login-wrap">
    <div class="login-bg"></div>
    <div class="app-navbar">
      <div class="user-avatar" @click="openLoginLayer('login')">
        <img src="@/assets/third-logo/google-icon.png" />
      </div>
      <div class="user-wallet" @click="openLoginLayer('wallet')">
        <img class="wallet-icon" src="@/assets/wallet/wallet-icon.svg" />
        Connect Wallet
      </div>
    </div>
    <div class="login-box scrollbar">
      <div class="login-inner">
        <img class="img1" src="@/assets/login/login-img1@3x.png" />
        <div class="text1">
          <span class="display-block">Prank your friends,</span>
          <span class="display-block">earn <span class="text2">$DUB</span> tokens.</span>
        </div>
        <div class="button-box">
          <Button title="Go prank" @click="openLoginLayer('login')" />
        </div>
        <img class="img2" src="@/assets/login/login-img2@3x.png" />
      </div>
    </div>
    <Teleport to="body">
      <Modal v-model:show="modalVisible" :title="loginTitle" :wrapper-class="['third-login-wrap']">
        <template #footer>
          <GoogleLogin :show="modalVisible" @token="handleFinish" />
        </template>
      </Modal>
    </Teleport>
    <Teleport to="body">
      <Loading v-if="pageLoading"> logging in </Loading>
    </Teleport>
    <Tabbar
      class="app-tabbar"
      :is-login="true"
      :menu-list="menuList"
      @click-menu="openLoginLayer('login')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Tabbar from '@/components/Tabbar/index.vue'
import Button from '@/components/Button/index.vue'
import Modal from '@/components/Modal/index.vue'
import GoogleLogin from '@/components/GoogleLogin/index.vue'
import Loading from '@/components/Loading/index.vue'
import { getDeviceInfo } from '@/utils/common'
import { useUserStore } from '@/stores/modules/user'
import asyncRoutes from '@/router/asyncRoutes'
import { LoginSourceEnum } from '@/api/model/user'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const loginTitle = ref('Log in or sign in')

const loginType = ref('login')
const pageLoading = ref(false)

function toDefault() {
  router.push({
    path: '/prank',
    query: {
      type: loginType.value
    }
  })
}

const googleTokenInfo = reactive({
  flag: false,
  submitFlag: false,
  token: ''
})

function submitGoogleToken() {
  if (googleTokenInfo.submitFlag) return
  googleTokenInfo.submitFlag = true
  const deviceInfo = getDeviceInfo()
  const source =
    deviceInfo.isIOS || deviceInfo.isAndroid ? LoginSourceEnum.PWA : LoginSourceEnum.Web
  pageLoading.value = true
  userStore
    .login({
      data: {
        google: {
          access_token: googleTokenInfo.token
        }
      },
      source
    })
    .then(() => {
      toDefault()
    })
    .finally(() => {
      pageLoading.value = false
      googleTokenInfo.submitFlag = false
      googleTokenInfo.flag = false
      googleTokenInfo.token = ''
    })
}

function handleFinish(googleToken) {
  console.log('googleToken:', googleToken)
  googleTokenInfo.flag = true
  googleTokenInfo.token = googleToken
  modalVisible.value = false
  submitGoogleToken()
}

const menuList = ref(asyncRoutes.filter(item => !item.meta?.hidden))

const modalVisible = ref(false)
function openLoginLayer(type) {
  console.log('openLoginLayer')
  loginType.value = type
  modalVisible.value = true
}

if (route.query.from === 'share') {
  loginTitle.value = 'Log in to get link'
  openLoginLayer('prank')
}
</script>

<style lang="less">
.common-modal-wrap.third-login-wrap {
  .common-modal-container {
    .common-modal-footer {
      margin-top: 2rem;
    }
  }
}
</style>

<style lang="less" scoped>
@import '@/styles/constant';
.login-wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  flex: 1;
  position: relative;
  background-color: #111010;
  .login-bg {
    position: absolute;
    max-width: 750px;
    width: 100%;
    top: 0;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-image: url('@/assets/login/login-bg@2x.png');
    background-position: center;
    background-size: cover;
  }
  .app-navbar {
    position: relative;
    height: 4.6rem;
    padding: 1rem 3rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user-avatar {
      width: 3.6rem;
      height: 3.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 8px solid transparent;
      border-image: url('@/assets/border/purple-1.svg') 8 fill stretch;
      img {
        width: 2rem;
        height: 2rem;
      }
    }
    .user-wallet {
      display: flex;
      align-items: center;
      font-family: PixeloidSans;
      font-size: 1.4rem;
      line-height: 2rem;
      color: @mainPurpleColor;
      height: 3.6rem;
      padding: 0 0.6rem;
      border: 8px solid transparent;
      border-image: url('@/assets/border/purple-1.svg') 8 fill stretch;
      .wallet-icon {
        width: 1.8rem;
        height: 1.6rem;
        margin-right: 0.8rem;
      }
    }
  }
  .login-box {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    .login-inner {
      margin: auto;
      position: relative;
      .img1 {
        width: 33rem;
        height: 21.5rem;
        display: block;
        margin: 0 auto;
      }
      .img2 {
        width: 9.4rem;
        height: 11.5rem;
        display: block;
        position: absolute;
        bottom: -12.3rem;
        left: -5.8rem;
      }
      .text1 {
        font-family: PixeloidSans-Bold;
        font-size: 2.6rem;
        line-height: 4rem;
        margin: 2.5rem 0 1.6rem;
        .display-block {
          display: block;
        }
      }
      .text2 {
        color: @primaryColor;
      }
      .button-box {
        width: 31.2rem;
        height: 5.5rem;
      }
    }
  }
  .app-tabbar {
    position: relative;
    height: 7.4rem;
    height: calc(7.4rem + constant(safe-area-inset-bottom));
    height: calc(7.4rem + env(safe-area-inset-bottom));
    padding-bottom: 0;
    padding-bottom: calc(constant(safe-area-inset-bottom));
    padding-bottom: calc(env(safe-area-inset-bottom));
  }
}
</style>
