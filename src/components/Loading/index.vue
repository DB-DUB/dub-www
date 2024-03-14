<template>
  <div class="common-modal-wrap">
    <div class="common-modal-bg"></div>
    <div class="common-modal-wrapper">
      <div class="common-modal-container">
        <img src="@/assets/loading-icon.svg" class="loading-icon" />
        <span class="loading-text">
          <slot>
            Loading...
          </slot>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
.common-modal-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  .common-modal-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
  }
  .common-modal-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .common-modal-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 8px solid transparent;
    border-image: url('@/assets/border/purple-2.svg') 8 fill stretch;
    padding: 1.2rem 1.6rem 1.6rem;
    min-width: 10rem;
    font-family: PixeloidSans;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .loading-icon {
      width: 4rem;
      height: 4rem;
      animation: loading-rotate 1.5s linear infinite;
    }
    .loading-text {
      font-size: 2rem;
      margin-top: 1rem;
    }
  }
}
@keyframes loading-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
