<template>
  <div v-show="realShow" class="common-modal-wrap" :class="dialogBaseClass">
    <div class="common-modal-bg"></div>
    <div class="common-modal-wrapper">
      <div class="common-modal-container">
        <img
          class="common-modal-close"
          :class="{ loading: loading }"
          src="@/assets/close-icon.svg"
          @click="closeModal"
        />
        <div class="common-modal-header">
          <slot name="header">
            {{ title }}
          </slot>
        </div>
        <div class="common-modal-body">
          <slot name="body">
            <div class="common-modal-content">
              {{ content }}
            </div>
          </slot>
        </div>
        <div class="common-modal-footer">
          <slot name="footer">
            <div class="common-modal-footer-inner">
              <Button :title="confirmText" @click="handleConfirm" :loading="loading" />
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SubName, pubSubUtil } from '@/utils/pub-sub'
import { ref, watch } from 'vue'
interface Props {
  show: boolean
  title?: string
  content?: string
  wrapperClass?: string[]
  confirmText?: string
  loading?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  isCmd: false,
  title: '',
  content: '',
  wrapperClass: [],
  confirmText: 'Confirm',
  loading: false
})

const emit = defineEmits(['update:show', 'close', 'confirm', 'closed'])
const realShow = ref(props.show)
const dialogBaseClass = ref([...props.wrapperClass])
watch(
  () => props.show,
  () => {
    if (props.show) {
      pubSubUtil.emit(SubName.OpenOtherModal)
      realShow.value = true
      window.requestAnimationFrame(() => {
        dialogBaseClass.value = [...props.wrapperClass, 'show']
      })
    } else {
      closeLayer()
    }
  },
  {
    immediate: true
  }
)

function closeModal() {
  emit('update:show', false)
  emit('close')
}

function handleConfirm() {
  emit('confirm')
}

function closeLayer() {
  dialogBaseClass.value = [...props.wrapperClass]
  setTimeout(() => {
    realShow.value = false
    emit('closed')
    pubSubUtil.emit(SubName.CloseOtherModal)
  }, 300)
}
</script>

<style lang="less" scoped>
.common-modal-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  &.show {
    .common-modal-bg {
      opacity: 1;
    }
    .common-modal-wrapper {
      transform: scale(1);
      opacity: 1;
    }
  }
  .common-modal-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    opacity: 0;
    transition: all 0.3s;
  }
  .common-modal-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: scale(0.8);
    opacity: 0;
    transition: all 0.3s;
  }
  .common-modal-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 8px solid transparent;
    border-image: url('@/assets/border/purple-2.svg') 8 fill stretch;
    padding: 1.2rem 1.6rem 1.6rem;
    width: 90%;
    max-width: 500px;
    font-family: PixeloidSans;
    .common-modal-close {
      position: absolute;
      width: 1rem;
      height: 1rem;
      padding: 0.5rem;
      right: 0.1rem;
      top: 0.1rem;
      cursor: pointer;
      &.loading {
        opacity: 0.3;
        pointer-events: none;
      }
    }
    .common-modal-header {
      position: relative;
      font-family: PixeloidSans-Bold;
      font-size: 2.2rem;
      line-height: 4rem;
    }
    .common-modal-content {
      font-size: 1.4rem;
      line-height: 2rem;
    }
    .common-modal-footer-inner {
      margin-top: 2.4rem;
    }
  }
}
</style>
