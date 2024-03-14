<template>
  <transition name="slide-fade">
    <div class="toast" :class="[type]" v-if="visible">
      <img v-if="iconSrc" :src="iconSrc" class="icon" alt="" />
      <p class="message">{{ message }}</p>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import warnIcon from '@/assets/toast/warn-icon.svg'
import successIcon from '@/assets/toast/success-icon.svg'
import errorIcon from '@/assets/toast/error-icon.svg'
import loadingIcon from '@/assets/loading-icon.svg'

interface Props {
  message: string
  duration?: number
  onClose: () => void
  type?: 'warn' | 'success' | 'error' | 'loading'
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
  type: 'warn'
})

const visible = ref<boolean>(false)

const iconSrc = computed(() => {
  switch (props.type) {
    case 'warn':
      return warnIcon
    case 'success':
      return successIcon
    case 'error':
      return errorIcon
    case 'loading':
      return loadingIcon
    default:
      return null
  }
})

const closeToast = () => {
  visible.value = false
  setTimeout(() => {
    props.onClose && props.onClose()
  }, 500)
}

onMounted(() => {
  visible.value = true
  if (props.duration !== Infinity) {
    setTimeout(() => {
      closeToast()
    }, props.duration)
  }
})
</script>

<style lang="less" scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.toast {
  min-height: 5.4rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 28.4rem;

  .message {
    color: #000000;
    font-family: PixeloidSans-Bold;
    font-size: 1.4rem;
    line-height: 2rem;
    word-break: break-word;
  }

  .icon {
    width: 3.6rem;
    height: 3.6rem;
    margin-right: 1rem;
  }

  &.warn {
    border: 10px solid transparent;
    border-image: url('@/assets/bg/white.svg') 10 fill stretch;
  }

  &.success {
    border: 10px solid transparent;
    border-image: url('@/assets/bg/white.svg') 10 fill stretch;
  }

  &.error {
    border: 10px solid transparent;
    border-image: url('@/assets/bg/white.svg') 10 fill stretch;
  }

  &.loading {
    justify-content: center;
    border: 10px solid transparent;
    border-image: url('@/assets/border/purple-2.svg') 10 fill stretch;

    .message {
      color: #787dff;
      font-family: PixeloidSans;
    }

    .icon {
      width: 2.4rem;
      height: 2.4rem;
      margin-right: 1rem;
      animation-name: rotate;
      animation-duration: 2s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
    }

    @keyframes rotate {
      0% {
        transform: rotateZ(0);
      }
      100% {
        transform: rotateZ(360deg);
      }
    }
  }
}
</style>
