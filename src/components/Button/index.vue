<template>
  <div
    class="button-container"
    :class="[type, theme, size, { disabled: disabled, loading: loading }]"
  >
    <div class="button-content">
      <img v-if="loading" src="@/assets/loading-icon.svg" class="loading-icon" />
      <slot name="icon" />
      <div class="title-wrap">
        <span v-if="size === 'large' || !loading" class="title">{{ title }}</span>
        <span class="subTitle" v-if="subTitle">{{ subTitle }}</span>
      </div>
    </div>
    <img v-if="badge" src="@/assets/bg/btn-badge.png" class="badge" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subTitle?: string
  type?: 'solid' | 'hollow'
  theme?: 'purple' | 'white'
  size?: 'large' | 'small' | 'mini'
  loading?: boolean
  disabled?: boolean
  badge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'solid',
  theme: 'purple',
  size: 'large',
  loading: false,
  title: 'Mint',
  disabled: false,
  badge: false
})
</script>

<style lang="less" scoped>
@import '@/styles/constant';
.button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 auto;
  cursor: pointer;
  position: relative;

  .button-content {
    display: flex;
    align-items: center;
    position: relative;
    justify-content: center;

    .loading-icon {
      position: absolute;
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

    .title-wrap {
      display: flex;
      flex-direction: column;
      align-items: center
    }
  }

  &.disabled {
    opacity: 0.3;
    pointer-events: none;
  }
  &.loading {
    pointer-events: none;
  }

  &.solid {
    &.white {
      border: 13px solid transparent;
      border-image: url('@/assets/bg/btn-white.svg') 13 fill stretch;
      &.mini {
        border: 8px solid transparent;
        border-image: url('@/assets/bg/btn-white-mini.svg') 8 fill stretch;
      }
      .title,.subTitle {
        color: #000000;
      }
      .loading-icon {
        filter: brightness(0);
      }
    }
    &.purple {
      border: 13px solid transparent;
      border-image: url('@/assets/bg/btn-purple.svg') 13 fill stretch;
      &.mini {
        border: 8px solid transparent;
        border-image: url('@/assets/bg/btn-purple-mini.svg') 8 fill stretch;
      }
      .title,.subTitle {
        color: #ffffff;
      }
      .loading-icon {
        filter: brightness(100);
      }
    }
  }

  &.hollow {
    border: 10px solid transparent;
    &.white {
      border-image: url('@/assets/border/white-2.svg') 10 fill stretch;
      .title,.subTitle {
        color: #ffffff;
      }
      .loading-icon {
        filter: brightness(100);
      }
    }
    &.purple {
      border-image: url('@/assets/border/purple-2.svg') 10 fill stretch;
      .title {
        color: #ffffff;
      }
    }
  }

  &.large {
    width: 100%;
    height: 5.4rem;
    .title {
      font-family: PixeloidSans-Bold;
      font-size: 1.8rem;
    }
    .subTitle {
      margin-top: 0.3rem;
      font-size: 1.2rem;
      font-family: PixeloidSans;
    }
    .loading-icon {
      width: 2.4rem;
      height: 2.4rem;
      left: -4.4rem;
    }

    .badge {
      width: 1.8rem;
      height: 1.8rem;
      position: absolute;
      right: calc(-13px - 0.3rem);
      top: calc(-13px - 0.9rem);
    }
  }

  &.small {
    flex: 0 0 auto;
    width: 9.2rem;
    height: 3.6rem;
    .title {
      font-family: PixeloidSans;
      font-size: 1.8rem;
    }
    .loading-icon {
      width: 2.4rem;
      height: 2.4rem;
    }
    .badge {
      width: 1.4rem;
      height: 1.4rem;
      position: absolute;
      right: calc(-13px - 0.3rem);
      top: calc(-13px - 0.6rem);
    }
  }

  &.mini {
    flex: 0 0 auto;
    width: 6.4rem;
    height: 2rem;
    .title {
      font-family: PixeloidSans;
      font-size: 1.2rem;
    }
    .loading-icon {
      width: 1.6rem;
      height: 1.6rem;
    }
    .badge {
      width: 0.9rem;
      height: 0.9rem;
      position: absolute;
      right: calc(-8px - 0.15rem);
      top: calc(-8px - 0.4rem);
    }
  }
}
</style>
