<template>
  <div class="app-wrap">
    <div ref="scrollerWrapRef" class="app-main-wrap">
      <AppMain :show-tabbar="showMenu" />
      <Navbar v-show="showMenu" class="app-navbar" />
      <Tabbar v-show="showMenu" class="app-tabbar" />
    </div>
    <Teleport to="body">
      <ShareModal v-bind="shareModalInfo" v-model:show="shareModalInfo.show" />
    </Teleport>
    <Teleport to="body">
      <EquipmentInfo
        :equipments="useModalStore().equipmentInfoModal.eqptList"
        :defaultId="useModalStore().equipmentInfoModal.defaultEqptId"
        v-model:visible="useModalStore().equipmentInfoModal.visible"
      />
    </Teleport>
    <Teleport to="body">
      <MergeEqpt v-model:visible="useModalStore().mergeEqptModal.visible" />
    </Teleport>
    <Teleport to="body">
      <MergeEqptResult
        v-model:visible="useModalStore().mergeEqptResultModal.visible"
        :isSuccess="useModalStore().mergeEqptResultModal.isSuccess"
        :params="useModalStore().mergeEqptResultModal.params"
        :result="useModalStore().mergeEqptResultModal.result"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, unref, reactive, watch, provide, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getShortUrl } from '@/api/common'
import { useUserStore } from '@/stores/modules/user'

import Navbar from '@/components/Navbar/index.vue'
import Tabbar from '@/components/Tabbar/index.vue'
import AppMain from './AppMain.vue'
import ShareModal from '@/components/ShareModal/index.vue'
import { useModalStore } from '@/stores/modules/modal'
import { useEqptStore } from '@/stores/modules/eqpt'

const { currentRoute } = useRouter()
const route = useRoute()
const userStore = useUserStore()

const showMenu = computed(() => {
  const meta = unref(currentRoute)?.meta || {}
  console.log('getShowMenu:', meta?.showMenu, unref(currentRoute))
  return meta?.showMenu
})

const scrollerWrapRef = ref()
const questionDomain = import.meta.env.VITE_CONFIG_DOMAIN
const shareOriginUrl = computed(() => `${questionDomain}/share/?userId=${userStore.userInfo.id}`)
const shareModalInfo = reactive({
  show: false,
  title: 'PRANK YOUR FRIENDS',
  content: [
    {
      type: 'text',
      value: `Super accurate AI personality test\n`
    },
    {
      type: 'link',
      value: ''
    },
    {
      type: 'text',
      value: ` #DUB`
    }
  ],
  shareInsContent: `Super accurate AI personality test`,
  shareInsUrl: ''
})

let watchUserId, watchRouterPath

onMounted(() => {
  watchUserId = watch(
    () => userStore.userInfo.id,
    (newVal, oldVal) => {
      if (newVal && newVal !== oldVal) {
        getShortUrl(shareOriginUrl.value).then(res => {
          shareModalInfo.content[1].value = res.short_url
          shareModalInfo.shareInsUrl = res.short_url
        })
      }
    },
    {
      immediate: true
    }
  )

  watchRouterPath = watch(
    () => route.path,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        scrollerWrapRef.value?.scrollTo({ top: 0 })
      }
    }
  )
})

onUnmounted(() => {
  watchUserId && watchUserId()
  watchRouterPath && watchRouterPath()
})

function showShareModal() {
  shareModalInfo.show = true
}
provide('showShareModal', showShareModal)
</script>

<style lang="less" scoped>
@import '../../styles/index';
.app-wrap {
  display: flex;
  flex-direction: column;
  .app-navbar {
    height: 4.6rem;
    position: fixed;
    background-color: #000;
    top: 0;
    left: 0;
    right: 0;
  }
  .app-main-wrap {
    position: relative;
    /*
    overflow-x: hidden;
    overflow-y: auto;
    */
  }
  .app-main-with-tabbar {
    padding-top: 4.6rem;
    /*
    padding-bottom: 7.4rem;
    padding-bottom: calc(7.4rem + constant(safe-area-inset-bottom));
    padding-bottom: calc(7.4rem + env(safe-area-inset-bottom));
    */
  }
  .app-tabbar {
    position: fixed;
    background-color: rgba(0, 0, 0, 0.8);
    bottom: 0;
    left: 0;
    right: 0;
    height: 7.4rem;
    height: calc(7.4rem + constant(safe-area-inset-bottom));
    height: calc(7.4rem + env(safe-area-inset-bottom));
    padding-bottom: 0;
    padding-bottom: calc(constant(safe-area-inset-bottom));
    padding-bottom: calc(env(safe-area-inset-bottom));
  }
}
</style>
