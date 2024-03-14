<template>
  <div class="lol-progress-wrap">
    <div class="lol-progress"></div>
    <div class="lol-progress-track-wrap">
      <img
        src="@/assets/equipment/progress-track-left.png"
        class="track-left"
        :class="{ show: progress > 0 }"
        alt=""
      />
      <div class="real-track-wrap">
        <div class="real-track" :style="{ transform: `translateX(-${100 - progress}%)` }"></div>
      </div>
      <img
        src="@/assets/equipment/progress-track-right.png"
        class="track-right"
        :class="{ show: progress === 100 }"
        alt=""
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  progress: number
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0
})
</script>

<style lang="less" scoped>
.lol-progress-wrap {
  display: flex;
  position: relative;
  height: 20px;
  justify-content: center;
  align-items: center;

  .lol-progress {
    width: 100%;
    height: 100%;
    position: absolute;
    border: 8px solid transparent;
    border-image: url('@/assets/border/purple-1.svg') 8 fill stretch;
    z-index: 1;
  }

  .lol-progress-track-wrap {
    position: relative;
    width: calc(100% - 6px);
    height: 14px;
    display: flex;
    z-index: 2;
    display: flex;
    align-items: center;

    .track-left {
      width: 6px;
      height: 8px;
      transition: opacity 0.2s;
      opacity: 0;
      transition-delay: 0.4s;

      &.show {
        opacity: 1;
        transition: opacity 0s;
      }
    }

    .track-right {
      width: 6px;
      height: 8px;
      opacity: 0;
      transition: opacity 0s;

      &.show {
        transition: opacity 0.2s;
        opacity: 1;
        transition-delay: 0.4s;
      }
    }

    .real-track-wrap {
      flex: 1;
      margin: 0 -0.5px;
      height: 100%;
      overflow: hidden;
      .real-track {
        width: 100%;
        height: 100%;
        background-color: #575dfc;
        transition: transform 0.5s;
      }
    }
  }
}
</style>
