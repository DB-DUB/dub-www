<template>
  <div class="main">
    <header v-if="!isMobile" class="header">
      <a href="" class="pointer">
        <img src="@/assets/index/logo.svg" alt="DUB" class="logo" decoding="async" loading="lazy" />
        <span class="app-name">DUB</span>
      </a>
      <div>
        <div v-if="indexReleased && userInfo.id" class="user-login pointer" @click="handleLogout">
          <img class="avatar" :src="userInfo.avatar" />
        </div>
        <div v-else class="user-login pointer" @click="openLoginLayer('login')">
          <img src="@/assets/third-logo/google-icon.png" />
        </div>
        <div
          class="user-wallet pointer"
          @click="connectWallet"
          @mouseover="isHoverWallet = true"
          @mouseout="isHoverWallet = false"
        >
          <img
            v-show="isHoverWallet"
            class="wallet-icon"
            src="@/assets/wallet/wallet-white-icon.svg"
          />
          <img v-show="!isHoverWallet" class="wallet-icon" src="@/assets/wallet/wallet-icon.svg" />
          <span>{{ indexReleased && userInfo.address ? showAddress : 'Connect Wallet' }}</span>
        </div>
      </div>
    </header>
    <section class="section section1">
      <div v-if="isMobile" class="btn-wrap">
        <div v-if="indexReleased && userInfo.id" class="user-login pointer" @click="handleLogout">
          <img class="avatar" :src="userInfo.avatar" />
        </div>
        <div v-else class="user-login" @click="openLoginLayer('login')">
          <img src="@/assets/third-logo/google-icon.png" />
        </div>
        <div class="user-wallet" @click="connectWallet">
          <img class="wallet-icon" src="@/assets/wallet/wallet-icon.svg" />
          {{ indexReleased && userInfo.address ? showAddress : 'Connect Wallet' }}
        </div>
      </div>
      <div v-if="isMobile" class="header">
        <img src="@/assets/index/logo.svg" alt="DUB" class="logo" decoding="async" loading="lazy" />
        <span class="app-name">DUB</span>
      </div>
      <div class="txt1">
        <img v-if="isMobile" src="@/assets/index/txt1-mob.png" />
        <img v-else src="@/assets/index/txt1-pc.png" />
      </div>
      <img src="@/assets/index/txt2.png" class="txt2" />
      <div v-if="indexReleased" class="jump-button-wrap">
        <Button title="Go to Prank" @click="gotoPrank">
          <template #icon>
            <img src="@/assets/index/arrow-right.svg" class="arrow-right" />
          </template>
        </Button>
      </div>
      <img v-else src="@/assets/index/txt3.png" class="txt3" />
      <picture v-if="isMobile" class="page-bg">
        <source srcset="@/assets/index/mob-bg.webp" type="image/webp" />
        <img src="@/assets/index/mob-bg.jpg" alt="index" decoding="async" loading="lazy" />
      </picture>
      <picture v-else class="page-bg">
        <source srcset="@/assets/index/pc-bg.webp" type="image/webp" />
        <img src="@/assets/index/pc-bg.jpg" alt="index" decoding="async" loading="lazy" />
      </picture>
    </section>
    <section class="section section2">
      <div class="box1">
        <div>
          <div class="title">How It <span class="highlight">Works</span>?</div>
          <div class="content">
            Dub is about having fun and having a sense of humor. Share a “personality test” and
            trick your friends into answering zesty questions that will be revealed to you. Prank
            your friends, earn $DUB, and spread that good vibe everywhere.
          </div>
        </div>
        <div class="box-wrap">
          <img
            src="@/assets/index/sec2-box1.png"
            class="sec2-box1"
            alt="how often"
            decoding="async"
            loading="lazy"
          />
          <img
            src="@/assets/index/sec2-box2.png"
            class="sec2-box2"
            alt="do you often"
            decoding="async"
            loading="lazy"
          />
        </div>
      </div>
      <div class="box2">
        <div class="title">Score the <span class="highlight">DUB</span> responsibly</div>
        <div class="content">
          Dubs are like love, they’re meant to be given to friends and close ones. Here are some
          values:
        </div>
        <div class="list">
          <div class="ul-item">
            <div class="title">
              <img
                src="@/assets/index/sec2-icon1.svg"
                class="sec2-icon1"
                alt="No Harm"
                decoding="async"
                loading="lazy"
              />
              No Harm
            </div>
            <div class="content">
              Our pranks are designed with laughter and joy in mind, intended to be harmless and
              respectful of everyone's well-being.
            </div>
          </div>
          <div class="divider"></div>
          <div class="ul-item">
            <div class="title">
              <img
                src="@/assets/index/sec2-icon2.svg"
                class="sec2-icon2"
                alt="Positive Vibes"
                decoding="async"
                loading="lazy"
              />
              Positive Vibes
            </div>
            <div class="content">
              Dub champions a positive culture and cultivates an uplifting and inclusive environment
              for everyone.
            </div>
          </div>
          <div class="divider"></div>
          <div class="ul-item">
            <div class="title">
              <img
                src="@/assets/index/sec2-icon3.svg"
                class="sec2-icon3"
                alt="Respect for All"
                decoding="async"
                loading="lazy"
              />
              Respect for All
            </div>
            <div class="content">
              We celebrate diversity, welcoming individuals from all cultures. Our content is
              multilingual and crafted with everyone in mind.
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section section3">
      <div>
        <div class="title">Dub Dub Dub</div>
        <div class="content">
          <div>
            Dub is free to play. Earn <span class="highlight">$DUB</span> with each successful
            prank, the more you prank the more you earn.
          </div>
          <br />
          <div>
            Unlock higher rewards with Dub Eggs. Level up for maximum minting efficiency and get
            even greater rewards.
          </div>
        </div>
      </div>
      <img
        src="@/assets/index/sec3-img1.png"
        class="sec3-img"
        alt="Dub Dub Dub"
        decoding="async"
        loading="lazy"
      />
    </section>
    <section class="section section4">
      <img
        src="@/assets/index/sec4-img1.png"
        class="sec4-img"
        alt="DUB Eggs"
        decoding="async"
        loading="lazy"
      />
      <div>
        <div class="title"><span class="highlight">DUB</span> Eggs</div>
        <div class="content">
          Eggs are limited edition NFTs that can be equipped to enhance mining efficiency. They are
          distributed randomly to players, and if you’re lucky, you might just get an egg with crazy
          stats!
        </div>
      </div>
    </section>
    <section class="section section5">
      <div>
        <img src="@/assets/index/$DUB.png" class="dub" alt="$DUB" decoding="async" loading="lazy" />
        <div class="title">
          <div>The currency&nbsp;</div>
          <div>of winners</div>
        </div>
        <div class="content">
          <span class="highlight">$DUB</span>, a Solana-based utility token, is the heartbeat of our
          ecosystem that rewards players for their participation and engagement. Successful pranks
          produce LOL points for in-game play and can be used to mint $DUB at a fixed rate.
        </div>
        <img
          src="@/assets/index/sec5-img1.png"
          class="sec5-img1"
          alt="1,000,000,000"
          decoding="async"
          loading="lazy"
        />
      </div>
      <div class="percent-wrap">
        <div class="ecosystem">
          <div class="num">60%</div>
          <div class="desc">Ecosystem</div>
        </div>
        <img
          src="@/assets/index/sec5-img2.png"
          class="sec5-img2"
          alt="Ecosystem"
          decoding="async"
          loading="lazy"
        />
        <div class="remain-percent">
          <div class="percent percent1">
            <div class="num">10%</div>
            <div class="desc">Liquidity</div>
          </div>
          <div class="percent percent2">
            <div class="num">10%</div>
            <div class="desc">Team</div>
          </div>
          <div class="percent percent3">
            <div class="num">10%</div>
            <div class="desc">Investors</div>
          </div>
          <div class="percent percent4">
            <div class="num">10%</div>
            <div class="desc">Eco</div>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer">
      <div class="logo-wrap">
        <img src="@/assets/index/logo.svg" alt="DUB" class="icon" decoding="async" loading="lazy" />
        <span v-if="!isMobile" class="app-name">DUB</span>
      </div>
      <div class="third-wrap">
        <a class="icon third-icon pointer"
          ><img src="@/assets/index/third1.svg" alt="X" decoding="async" loading="lazy"
        /></a>
        <a class="icon third-icon pointer"
          ><img src="@/assets/index/third2.svg" alt="DUB1" decoding="async" loading="lazy"
        /></a>
        <a class="icon third-icon pointer"
          ><img src="@/assets/index/third3.svg" alt="DUB2" decoding="async" loading="lazy"
        /></a>
      </div>
    </footer>
    <Teleport to="body">
      <Modal
        v-model:show="modalVisible"
        title="Log in or sign in"
        :wrapper-class="['third-login-wrap']"
      >
        <template #footer>
          <GoogleLogin :show="modalVisible" @token="handleFinish" />
        </template>
      </Modal>
    </Teleport>
    <Teleport to="body">
      <Modal
        v-model:show="modalInfo.walletVisible"
        title="Connect Wallet"
        :wrapper-class="['connect-wallet-wrap']"
      >
        <template #footer>
          <div class="common-modal-footer-inner">
            <Button title="Phantom" @click="handleConnectWallet(WalletType.Phantom)">
              <template #icon>
                <img class="button-icon" src="@/assets/wallet/wallet-phantom-icon.png" />
              </template>
            </Button>
            <Button title="OKX" @click="handleConnectWallet(WalletType.Okx)">
              <template #icon>
                <img class="button-icon" src="@/assets/wallet/wallet-okx-icon.png" />
              </template>
            </Button>
          </div>
        </template>
      </Modal>
    </Teleport>
    <Teleport to="body">
      <Loading v-if="pageLoading">
        logging in
      </Loading>
    </Teleport>
    <Teleport to="body">
      <Modal
        v-model:show="modalInfo.addressVisible"
        title="Wallet"
        :content="userInfo.address"
        :wrapper-class="['show-address-wrap']"
      >
        <template #footer>
          <div class="common-modal-footer-inner">
            <CopyButton title="Copy address" :source="userInfo.address" />
          </div>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { commonModal } from '@/components/Modal/index'
import Modal from '@/components/Modal/index.vue'
import GoogleLogin from '@/components/GoogleLogin/index.vue'
import Loading from '@/components/Loading/index.vue'
import CopyButton from '@/components/CopyButton/index.vue'
import { WalletType } from '@/api/model/web3'
import { LoginSourceEnum } from '@/api/model/user'
import { getDeviceInfo } from '@/utils/common'
import { useUserStore, useUserStoreWithOut } from '@/stores/modules/user'
import { isInOkxApp, isInPhantomApp } from '@/utils/web3/base'
import { SubName, pubSubUtil } from '@/utils/pub-sub'

const indexReleased = ref(import.meta.env.VITE_FLAG_INDEX_RELEASE === 'true')
console.log('indexReleased:', indexReleased, typeof indexReleased)
const isHoverWallet = ref(false)

const rect = document.body.getBoundingClientRect()
const isMobile = rect.width - 1 < 768

const loginType = ref('login')
const pageLoading = ref(false)
const modalVisible = ref(false)
const modalInfo = reactive({
  walletVisible: false,
  addressVisible: false
})

const userStore = useUserStore()
const router = useRouter()

const userInfo = computed(() => {
  return userStore.userInfo
})
const showAddress = computed(() => {
  const address = userInfo.value.address || ''
  return address.slice(0, 4) + '...' + address.slice(-4)
})

function connectWallet() {
  if (!userInfo.value.address && indexReleased.value) {
    if (!userInfo.value.id) {
      openLoginLayer('wallet')
    } else {
      if (isInPhantomApp()) {
        handleConnectWallet(WalletType.Phantom)
      } else if (isInOkxApp()) {
        handleConnectWallet(WalletType.Okx)
      } else {
        modalInfo.walletVisible = true
      }
    }
  } else {
    modalInfo.addressVisible = true
  }
}

function gotoPrank() {
  router.push({ path: '/prank' })
}

async function handleConnectWallet(type) {
  useUserStoreWithOut().bindWallet(type)
  modalInfo.walletVisible = false
}

function handleLogout() {
  commonModal.open({
    wrapperClass: ['logout-confirm-wrap'],
    title: 'Log out your account?',
    confirmText: 'Log out',
    onConfirm: () => {
      userStore.logout()
    }
  })
}

function handleFinish(googleToken) {
  console.log('googleToken:', googleToken)
  modalVisible.value = false
  const deviceInfo = getDeviceInfo()
  const source =
    deviceInfo.isIOS || deviceInfo.isAndroid ? LoginSourceEnum.PWA : LoginSourceEnum.Web
  pageLoading.value = true
  userStore
    .login({
      data: {
        google: {
          access_token: googleToken
        }
      },
      source
    })
    .then(() => {
      userStore.getUserInfo('index')
      if (loginType.value === 'wallet') {
        connectWallet()
      }
    })
    .finally(() => {
      pageLoading.value = false
    })
}

function openLoginLayer(type) {
  if (!indexReleased.value) return
  loginType.value = type
  modalVisible.value = true
}

function scrollFunc() {
  const len = window.scrollY || window.pageYOffset
  const section1 = document.querySelector('.section1')
  // const section2 = document.querySelector('.section2')
  // const section3 = document.querySelector('.section3')
  // const section4 = document.querySelector('.section4')
  const sectionHeight = section1?.clientHeight || 0
  const h1 = section1?.offsetTop + sectionHeight / 2
  // const h2 = section2.offsetTop + sectionHeight / 2
  // const h3 = section3.offsetTop + sectionHeight / 2
  // const h4 = section4.offsetTop + sectionHeight / 2

  if (len) {
    if (len > h1) {
      document.getElementsByTagName('header')[0]?.classList.add('shadow-bg')
    } else {
      hideTop()
    }
  } else hideTop()
}

function hideTop() {
  document.getElementsByTagName('header')[0]?.classList.remove('shadow-bg')
}

window.ontouchstart = document.onscroll = scrollFunc

let subBindWalletKey
onMounted(() => {
  scrollFunc()
  pubSubUtil.on(SubName.BindWallet, () => {
    connectWallet()
  })
})
onUnmounted(() => {
  subBindWalletKey && pubSubUtil.off(SubName.BindWallet)
})
</script>

<style>
@media screen and (min-width: 1920px) {
  html.index,
  html.index body {
    font-size: 13px;
  }
}
@media screen and (min-width: 1661px) and (max-width: 1919px) {
  html.index,
  html.index body {
    font-size: 12px;
  }
}
@media screen and (min-width: 1441px) and (max-width: 1660px) {
  html.index,
  html.index body {
    font-size: 11px;
  }
}
@media screen and (min-width: 1301px) and (max-width: 1440px) {
  html.index,
  html.index body {
    font-size: 10px;
  }
}
@media screen and (min-width: 1221px) and (max-width: 1300px) {
  html.index,
  html.index body {
    font-size: 9px;
  }
}
@media screen and (min-width: 1001px) and (max-width: 1220px) {
  html.index,
  html.index body {
    font-size: 8px;
  }
}
@media screen and (min-width: 768px) and (max-width: 1000px) {
  html.index,
  html.index body {
    font-size: 7px;
  }
}
</style>

<style lang="less" scoped>
@import '@/styles/constant';
@purpleColor: #575dfc;
@yellowColor: #ffd63e;

.main {
  font-family: PixeloidSans;
  overflow-x: hidden;
  cursor: url('@/assets/index/cursor-default.png'), auto;
}
.pointer {
  cursor: url('@/assets/index/cursor-pointer.png'), pointer;
}
.section {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  position: relative;
  width: 100%;
}
.header {
  .logo {
    width: 3.6rem;
    height: 3.6rem;
  }
}
.app-name {
  margin-left: 1.2rem;
  font-size: 3rem;
  line-height: 4rem;
  color: #fff;
  font-family: PixeloidSans-Bold;
}
.title {
  font-family: PixeloidSans-Bold;
}
.user-login {
  height: 3.6rem;
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  line-height: 2rem;
  color: @mainPurpleColor;
  border: 8px solid transparent;
  border-image: url('@/assets/border/purple-0.svg') 8 fill stretch;
  img {
    width: 2rem;
    height: 2rem;
    &.avatar {
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 50%;
    }
  }
  span {
    margin-left: 2.5rem;
  }
}
.user-wallet {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  line-height: 2rem;
  color: @mainPurpleColor;
  white-space: nowrap;
  height: 3.6rem;
  border: 8px solid transparent;
  border-image: url('@/assets/border/purple-0.svg') 8 fill stretch;
  .wallet-icon {
    width: 1.6rem;
    height: 1.4rem;
    margin-right: 0.8rem;
  }
}
.section1 {
  height: 100vh;
  & > * {
    z-index: 1;
  }
  .header {
    display: flex;
    padding: 6.6rem 0 0 3rem;
  }
  .txt1 img {
    margin-top: 7.2rem;
    margin-left: 2.8rem;
    height: 20.8rem;
  }
  .txt2 {
    margin-top: 5rem;
    margin-left: 3.7rem;
    height: 2.9rem;
  }
  .jump-button-wrap {
    margin-top: 3rem;
    margin-left: 3rem;
    :deep(.button-content) {
      padding: 0 1rem;
    }
    .arrow-right {
      margin-right: 1.2rem;
    }
  }
  .txt3 {
    margin-top: 1.4rem;
    margin-left: 3.7rem;
    height: 2.9rem;
  }
  .btn-wrap {
    display: flex;
    justify-content: center;
    padding: 3rem 0 0 3rem;
    .user-wallet {
      margin-left: 1.2rem;
    }
  }
  /*
  .btn-wrap {
    margin-top: 8.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    .user-wallet {
      width: 16rem;
      margin-right: 1.3rem;
    }
    .user-login {
      width: 16rem;
    }
  }
  */
  .page-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    > * {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
.section2 {
  padding: 8.6rem 3.2rem 0;
  .title {
    font-size: 2.4rem;
    line-height: 2.6rem;
    .highlight {
      color: @yellowColor;
    }
  }
  .content {
    font-size: 1.2rem;
    line-height: 1.6rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 1.8rem;
  }
  .box1 {
    width: calc(100% - 6.4rem);
    border: 12px solid transparent;
    border-image: url('@/assets/index/purple-bg.svg') 12 fill stretch;
    padding: 1.2rem 0 0.9rem 1.2rem;
    display: flex;
    flex-direction: column;
    .box-wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    .sec2-box1 {
      height: 6.6rem;
    }
    .sec2-box2 {
      margin-top: 0.4rem;
      height: 6.6rem;
    }
  }
  .box2 {
    width: calc(100% - 6.4rem);
    margin-top: 4rem;
    border: 6px solid transparent;
    border-image: url('@/assets/index/deep-gray-bg.svg') 6 fill stretch;
    padding: 1.2rem 1.5rem 0 1.5rem;
    .title {
      font-size: 2.4rem;
      line-height: 3.2rem;
      .highlight {
        color: @purpleColor;
      }
    }
    .content {
      margin-bottom: 0.4rem;
    }
    .list {
      display: flex;
      flex-direction: column;
      .ul-item {
        .title {
          display: flex;
          align-items: center;
          margin-top: 2.3rem;
          font-size: 2rem;
          line-height: 2.7rem;
          img {
            width: 3.6rem;
            height: 3.6rem;
            margin-right: 1.2rem;
          }
        }
        .content {
          margin-top: 1.3rem;
          margin-bottom: 2.3rem;
        }
        &:last-child {
          .content {
            margin-bottom: 1.5rem;
          }
        }
      }
      .divider {
        width: 100%;
        height: 0;
        border-top: 1px dashed #333;
      }
    }
  }
}
.section3 {
  padding: 14.4rem 3.6rem 0;
  width: calc(100% - 7.2rem);
  .title {
    font-size: 3.2rem;
    color: @purpleColor;
  }
  .content {
    margin-top: 2rem;
    font-size: 1.4rem;
    line-height: 1.8rem;
    color: #aaa;
    .highlight {
      color: @yellowColor;
    }
  }
  .sec3-img {
    margin-top: 4rem;
    width: 30.2rem;
  }
}
.section4 {
  padding: 18.4rem 2.1rem 0;
  width: calc(100% - 4.2rem);
  .sec4-img {
    width: 33.2rem;
  }
  .title {
    font-size: 3.2rem;
    margin-top: 4rem;
    .highlight {
      color: @purpleColor;
    }
  }
  .content {
    margin-top: 2rem;
    font-size: 1.4rem;
    line-height: 1.8rem;
    color: #aaa;
  }
}
.section5 {
  padding: 17.4rem 2.8rem 0;
  width: calc(100% - 5.6rem);
  .dub {
    height: 4.3rem;
  }
  .title {
    display: flex;
    flex-direction: column;
    font-size: 2.4rem;
    line-height: 3.2rem;
    margin-top: 2rem;
  }
  .content {
    font-size: 1.4rem;
    line-height: 1.8rem;
    margin-top: 2rem;
    color: #aaa;
    .highlight {
      color: @yellowColor;
    }
  }
  .sec5-img1 {
    margin-top: 2rem;
    width: 31.9rem;
  }
  .num {
    font-size: 2rem;
    font-family: PixeloidSans-Bold;
  }
  .desc {
    font-size: 1.4rem;
    line-height: 2rem;
  }
  .percent-wrap {
    margin: auto;
  }
  .ecosystem {
    margin-left: 20rem;
    margin-top: 2rem;
  }
  .sec5-img2 {
    width: 29.1rem;
    margin-top: 2rem;
  }
  .remain-percent {
    display: flex;
    justify-content: space-between;
    margin-top: 1.8rem;
    .percent1 {
      color: @purpleColor;
    }
    .percent2 {
      color: @yellowColor;
    }
    .percent3 {
      color: #f2b692;
    }
    .percent4 {
      color: #05e26e;
    }
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  padding: 11.2rem 3rem 3rem;
  padding-bottom: calc(3rem + env(safe-area-inset-bottom));
  padding-bottom: calc(3rem + constant(safe-area-inset-bottom));
  .icon {
    width: 3.6rem;
    height: 3.6rem;
  }
  .third-wrap {
    display: flex;
    > a:not(:last-child) {
      margin-right: 2rem;
    }
  }
  .third-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: 8px solid transparent;
    border-image: url('@/assets/border/purple-0.svg') 8 fill stretch;
    img {
      height: 1.2rem;
    }
    &:last-child {
      img {
        width: 1.6rem;
      }
    }
  }
}

@media (min-width: 768px) {
  .header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2.4rem 6rem;
    width: calc(100% - 12rem);
    > div {
      display: flex;
    }
    a {
      display: flex;
    }
    .user-login {
      justify-content: center;
      width: 3.6rem;
      height: 3.6rem;
      img {
        width: 2rem;
        height: 2rem;
        margin-left: 0;
        &.avatar {
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 50%;
        }
      }
      &:hover {
        border-image: url('@/assets/index/hover-bg.svg') 8 fill stretch;
      }
    }
    .user-wallet {
      margin-left: 2rem;
      color: @mainPurpleColor;
      height: 3.6rem;
      &:hover {
        border-image: url('@/assets/index/hover-bg.svg') 8 fill stretch;
        > span {
          color: #fff;
        }
      }
    }
    &.shadow-bg {
      background: rgba(0, 0, 0, 0.2);
    }
  }
  .section1 {
    .txt1 img {
      margin-top: 30vh;
      margin-left: 16rem;
    }
    .txt2 {
      margin-top: 8rem;
    }
    .txt2,
    .txt3 {
      margin-left: 18.2rem;
      height: 4rem;
    }

    .jump-button-wrap {
      margin-left: 18.2rem;
      margin-top: 2.4rem;
    }
  }
  .section2 {
    padding: 3rem 12.2rem 0;
    .title {
      font-size: 3.6rem;
      line-height: 4rem;
    }
    .content {
      font-size: 1.6rem;
      line-height: 2.4rem;
      margin-top: 3rem;
      width: 48.8rem;
    }
    .box1 {
      padding: 4.6rem 9.5rem 4.6rem 5.2rem;
      width: calc(100% - 24.4rem);
      flex-direction: row;
      justify-content: space-between;
      .sec2-box1 {
        height: 9rem;
      }
    }
    .box2 {
      padding: 4.5rem 4.5rem 3.8rem 5.2rem;
      width: calc(100% - 24.4rem);
      .title {
        font-size: 3.6rem;
        line-height: 4rem;
      }
      .list {
        margin-top: 3.5rem;
        flex-direction: row;
        justify-content: space-between;
        .ul-item {
          display: flex;
          flex-direction: column;
          .title {
            margin-top: 0;
            font-size: 2.8rem;
            line-height: 2.8rem;
          }
          .content {
            width: 31rem;
            margin-top: 1.8rem;
            margin-bottom: 0;
            color: #aaa;
          }
          &:last-child {
            .content {
              margin-bottom: 1.5rem;
            }
          }
        }
        .divider {
          width: 0;
          height: 15rem;
          border-top: 0;
          border-left: 1px dashed #333;
        }
      }
    }
  }
  .section3 {
    padding: 26rem 22.5rem 0 12.2rem;
    width: calc(100% - 34.7rem);
    flex-direction: row;
    justify-content: space-between;
    .title {
      font-size: 4.8rem;
    }
    .content {
      margin-top: 5.2rem;
      font-size: 2rem;
      line-height: 2.8rem;
      width: 55.4rem;
    }
    .sec3-img {
      width: 46.5rem;
      margin-top: -3rem;
    }
  }
  .section4 {
    padding: 34rem 0 0 19.2rem;
    width: calc(100% - 19.2rem);
    flex-direction: row;
    align-items: center;
    .sec4-img {
      width: 44.2rem;
    }
    > div {
      margin-left: 8.5rem;
    }
    .title {
      font-size: 4.8rem;
      margin-top: 4rem;
    }
    .content {
      margin-left: 0;
      margin-top: 4.4rem;
      font-size: 2rem;
      line-height: 2.8rem;
      width: 57rem;
    }
  }
  .section5 {
    padding: 20.9rem 12.2rem 0;
    width: calc(100% - 24.4rem);
    flex-direction: row;
    .dub {
      height: 6.6rem;
    }
    .title {
      flex-direction: row;
      font-size: 3.6rem;
      line-height: 6.6rem;
      margin-top: 0;
    }
    .content {
      font-size: 2rem;
      line-height: 2.8rem;
      margin-top: 3.6rem;
      width: 63.8rem;
    }
    .sec5-img1 {
      width: 64rem;
      margin-top: 4.4rem;
    }
    .percent-wrap {
      margin-left: 8rem;
      margin-top: 10rem;
    }
    .num {
      font-size: 2.8rem;
    }
    .desc {
      font-size: 2rem;
      line-height: 2.8rem;
    }
    .ecosystem {
      margin-left: 26rem;
    }
    .sec5-img2 {
      width: 38.8rem;
      margin-top: 3rem;
    }
    .remain-percent {
      margin-top: 2.2rem;
    }
  }
  .footer {
    padding: 24.5rem 6rem 4.6rem;
    .logo-wrap {
      display: flex;
    }
    .third-icon {
      &:hover {
        border-image: url('@/assets/index/hover-bg.svg') 8 fill stretch;
      }
    }
  }
}
</style>
