<template>
  <Button v-bind="$attrs" @click="copy(source)" />
</template>

<script setup lang="ts">
import { watch, unref } from 'vue'
import Button from '@/components/Button/index.vue'
import ToastManager from '@/components/Toast/ToastManager.ts'
import { useClipboard } from '@vueuse/core'

interface Props {
  source: string
}
const props = defineProps<Props>()

const { copy, copied } = useClipboard({ source: props.source, legacy: true })

const emit = defineEmits(['click'])

watch(
  () => unref(copied),
  val => {
    if (val) {
      ToastManager().showToast('Copy Success', 'success')
      emit('click')
    }
  }
)
</script>

<style lang="less" scoped>
.block {
  display: block;
}
</style>
