<template>
  <div class="page404">
    <img class="icon" src="@/assets/404/404-icon.png" />
    <div class="text">Where are u?</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
function back() {
  router.push({ path: '/' })
}
</script>

<style lang="less" scoped>
.page404 {
  height: 100%;
  background-image: url('@/assets/404/404-bg.jpg');
  background-position: 0 0;
  background-repeat: repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .icon {
    width: 9.5rem;
    height: 9.1rem;
  }
  .text {
    font-family: PixeloidSans-Bold;
    font-size: 2.2rem;
    line-height: 3.2rem;
    margin: 2rem 0 10rem;
  }
}
</style>
