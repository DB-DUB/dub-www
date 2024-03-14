<template>
  <section class="app-main" :class="{ 'app-main-with-tabbar': showTabbar }">
    <!-- <RouterView />
     -->
    <router-view v-slot="{ Component }">
      <Transition name="slide-fade">
        <keep-alive>
          <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
        </keep-alive>
      </Transition>
      <Transition name="slide-fade">
        <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
      </Transition>
      <!-- <Transition name="slide-fade">
        <component :is="Component" />
      </Transition> -->
    </router-view>
  </section>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

interface Props {
  showTabbar?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  showTabbar: true
})
</script>

<style lang="less" scoped>
.app-main {
  > * {
    position: absolute;
    background-color: #000;
    width: 100%;
    min-height: calc(100vh - 4.6rem);
  }
  &.app-main-with-tabbar > * {
    padding-bottom: 7.4rem;
    padding-bottom: calc(7.4rem + constant(safe-area-inset-bottom));
    padding-bottom: calc(7.4rem + env(safe-area-inset-bottom));
  }
}
</style>
