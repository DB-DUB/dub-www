<template>
  <Modal
    :show="show"
    :title="title"
    :wrapper-class="['share-modal-wrap']"
    @update:show="$emit('update:show', $event)"
  >
    <template #body>
      <div class="common-modal-content">
        <span v-for="(item, index) in content" :key="index">
          <span v-if="item.type === 'text'" class="text">{{ item.value }}</span>
          <a
            v-else-if="item.type === 'link'"
            target="_blank"
            referrerpolicy="no-referrer"
            class="link"
            :href="item.value"
            >{{ item.value }}</a
          >
        </span>
      </div>
      <div class="hint">Post to social media & group chats</div>
    </template>
    <template #footer>
      <div class="common-modal-footer-inner">
        <CopyButton title="Copy" :source="copySource" />
        <Button title="X" @click="postTwitter">
          <template #icon>
            <img class="button-icon" src="@/assets/third-logo/twitter-logo.png" />
          </template>
        </Button>
        <Button title="Ins" @click="openShareInsModal">
          <template #icon>
            <img class="button-icon" src="@/assets/third-logo/ins-logo.png" />
          </template>
        </Button>
      </div>
    </template>
  </Modal>
  <Teleport to="body">
    <ShareInsModal
      v-model:show="shareInsModalShow"
      :title="title"
      :content="shareInsContent"
      :url="shareInsUrl"
      @shared="checkShowPWA"
    />
  </Teleport>
  <Teleport to="body">
    <InstallPWA v-model:show="installPWAShow" />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import Modal from '@/components/Modal/index.vue'
import Button from '@/components/Button/index.vue'
import CopyButton from '@/components/CopyButton/index.vue'
import InstallPWA from '@/components/InstallPWA/index.vue'
import ShareInsModal from './ShareInsModal.vue'
import { usePageVisibility } from '@/utils/composables/usePageVisibility'
import { getDeviceInfo } from '@/utils/common'
import { getUseWebFlag } from '@/utils/auth'

interface Props {
  show: boolean
  title?: string
  content?: Array<{
    type: string
    value: string
  }>
  shareInsContent?: string
  shareInsUrl?: string
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: [],
  shareInsContent: '',
  shareInsUrl: ''
})
const copySource = computed(() => {
  return props.content.map(item => item.value).join('\n')
})
const { isPageHidden, visibilityChange } = usePageVisibility()
const hasShareThirdLeave = ref(false)
const deviceInfo = getDeviceInfo()
function postTwitter() {
  const baseUrl = import.meta.env.VITE_SHARE_TWEET
  const text = copySource.value
  const link = `${baseUrl}?text=${encodeURIComponent(text)}`
  hasShareThirdLeave.value = true
  window.open(link, '_blank')
}
const installPWAShow = ref(false)
const shareInsModalShow = ref(false)

function openShareInsModal() {
  shareInsModalShow.value = true
}

function pageChange(e) {
  if (isPageHidden() || e.hidden || document.visibilityState === 'hidden') {
    console.log('hidden')
  } else {
    console.log('not hidden')
    if (hasShareThirdLeave.value) {
      // Third-party sharing jumps away and then comes back, which is considered a successful sharing
      checkShowPWA()
      hasShareThirdLeave.value = false
    }
  }
}

function checkShowPWA() {
  const useWebFlag = getUseWebFlag()
  if (deviceInfo.isMobilePWAInstall && useWebFlag !== '1') {
    installPWAShow.value = true
  }
}

onBeforeMount(() => {
  document.addEventListener(visibilityChange, pageChange, false)
})

onBeforeUnmount(() => {
  document.removeEventListener(visibilityChange, pageChange, false)
})
</script>

<style lang="less">
.common-modal-wrap.share-modal-wrap {
  .common-modal-container {
    .common-modal-header {
      font-size: 2.1rem;
      text-align: center;
    }
    .common-modal-content {
      margin: 1.5rem 0 1.5rem;
      border: 8px solid transparent;
      border-image: url('@/assets/bg/share-content-box.svg') 8 fill stretch;
      font-size: 1.4rem;
      line-height: 2rem;
      padding: 0.2rem 0.5rem;
      word-break: break-word;
      white-space: pre-line;
      .text {
        color: #000;
      }
      .link {
        color: #1e66ff;
      }
    }
    .hint {
      font-family: PixeloidSans;
      font-size: 1.4rem;
      line-height: 2rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    .common-modal-footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .button-container {
        flex: 1;
        .button-icon {
          width: 2.4rem;
          height: 2.4rem;
          margin-right: 0.4rem;
        }
      }
      .button-container + .button-container {
        margin-left: 0.4rem;
      }
    }
  }
}
</style>
