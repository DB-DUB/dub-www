<template>
  <div class="google-login" id="google-login-box"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

interface Props {
  show: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['token'])

function handleCredentialResponse(response) {
  const token = response.credential
  console.log('Encoded JWT ID token: ' + token)
  emit('token', token)
}
const windowW = document.documentElement.clientWidth
onMounted(() => {
  try {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      context: 'signin',
      itp_support: true,
      use_fedcm_for_prompt: true,
      callback: handleCredentialResponse
    })
    google.accounts.id.renderButton(document.getElementById('google-login-box'), {
      // customization attributes
      theme: 'outline',
      // theme: 'filled_blue',
      size: 'large',
      width: Math.round((284 * Math.min(windowW, 750)) / 375)
    })
  } catch(e) {}
})
</script>

<style lang="less" scoped></style>
