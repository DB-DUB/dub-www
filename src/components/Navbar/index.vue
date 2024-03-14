<template>
  <div class="navbar-wrap">
    <div class="user-avatar" @click="handleLogout">
      <img :src="userInfo.avatar" />
    </div>
    <div class="user-info">
      <div class="user-lol" @click="showTotalLOL">
        <img class="gold-icon" src="@/assets/prank/coin-lol.png"> {{ commonShortNumberFormat(Number(userInfo?.lol || 0)) }}
      </div>
      <div class="user-wallet" @click="connectWallet">
        <img class="wallet-icon" src="@/assets/wallet/wallet-icon.svg" />
        {{ userInfo.address ? showAddress : 'Connect Wallet' }}
      </div>
    </div>

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
import { reactive, computed, h, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore, useUserStoreWithOut } from '@/stores/modules/user'
import { commonModal } from '@/components/Modal/index'
import Modal from '@/components/Modal/index.vue'
import CopyButton from '@/components/CopyButton/index.vue'
import { commonShortNumberFormat, commonNumberFormat } from '@/utils/filter/number'
import { WalletType } from '@/api/model/web3'
import { isInOkxApp, isInPhantomApp } from '@/utils/web3/base'
import { SubName, pubSubUtil } from '@/utils/pub-sub'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const userInfo = computed(() => {
  return userStore.userInfo
})
const showAddress = computed(() => {
  const address = userInfo.value.address || ''
  return address.slice(0, 4) + '...' + address.slice(-4)
})

const modalInfo = reactive({
  walletVisible: false,
  addressVisible: false
})

function handleLogout() {
  commonModal.open({
    wrapperClass: ['logout-confirm-wrap'],
    title: 'Log out your account?',
    confirmText: 'Log out',
    onConfirm: () => {
      userStore.logout().then(() => {
        router.push('/login')
      })
    }
  })
}

function showTotalLOL() {
  commonModal.open(
    {
      wrapperClass: ['total-lol-show-wrap'],
      title: 'Your GOLD',
      content: String(commonNumberFormat(Number(userInfo.value?.lol || 0)))
    },
    {
      footer: () => h('div', '')
    }
  )
}

function connectWallet() {
  if (!userInfo.value.address) {
    if (isInPhantomApp()) {
      handleConnectWallet(WalletType.Phantom)
    } else if (isInOkxApp()) {
      handleConnectWallet(WalletType.Okx)
    } else {
      modalInfo.walletVisible = true
    }
  } else {
    modalInfo.addressVisible = true
  }
}

async function handleConnectWallet(type) {
  useUserStoreWithOut().bindWallet(type)
  modalInfo.walletVisible = false
}

let subBindWalletKey
onMounted(() => {
  if (route.query.type === 'wallet' && !userInfo.value.address) {
    connectWallet()
  }
  pubSubUtil.on(SubName.BindWallet, () => {
    connectWallet()
  })
})
onUnmounted(() => {
  subBindWalletKey && pubSubUtil.off(SubName.BindWallet)
})
</script>

<style lang="less">
.common-modal-wrap.logout-confirm-wrap {
  .common-modal-container {
    .common-modal-header {
      font-size: 1.8rem;
    }
  }
}
.common-modal-wrap.total-lol-show-wrap {
  .common-modal-container {
    .common-modal-header {
      text-align: center;
    }
    .common-modal-content {
      text-align: center;
      font-size: 3rem;
      line-height: 5rem;
    }
  }
}
.common-modal-wrap.connect-wallet-wrap {
  .common-modal-container {
    .common-modal-footer-inner {
      margin-top: 2rem;
      .button-icon {
        width: 2.4rem;
        height: 2.4rem;
        margin-right: 1.3rem;
      }
      .button-container + .button-container {
        margin-top: 2rem;
      }
    }
  }
}
.common-modal-wrap.show-address-wrap {
  .common-modal-container {
    .common-modal-header {
      text-align: center;
    }
    .common-modal-content {
      text-align: center;
      word-break: break-word;
      margin-top: 1rem;
    }
    .common-modal-footer-inner {
      margin-top: 2.4rem;
    }
  }
}
</style>

<style lang="less" scoped>
@import '@/styles/constant';
.navbar-wrap {
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
      width: 2.4rem;
      height: 2.4rem;
      border-radius: 50%;
    }
  }
  .user-info {
    display: flex;
    align-items: center;
  }
  .user-lol,
  .user-wallet {
    display: flex;
    align-items: center;
    font-family: PixeloidSans;
    font-size: 1.4rem;
    line-height: 2rem;
    height: 3.6rem;
    border: 8px solid transparent;
    border-image: url('@/assets/border/purple-1.svg') 8 fill stretch;
    cursor: pointer;
  }
  .user-lol {
    color: @primaryColor;
    padding: 0 0.2rem;
    .gold-icon {
      width: 2.1rem;
      height: 2rem;
      margin-right: 0.8rem;
    }
  }
  .user-wallet {
    color: @mainPurpleColor;
    margin-left: 0.7rem;
    padding: 0 0.6rem;
    .wallet-icon {
      width: 1.8rem;
      height: 1.6rem;
      margin-right: 0.8rem;
    }
  }
}
</style>
