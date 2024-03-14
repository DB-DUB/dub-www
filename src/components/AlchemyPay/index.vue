<template>
  <div class="pay-wrap">
    <div id="rampView" class="pay-box"></div>
    <img src="@/assets/shop/alchemy-back.png" class="close-btn" @click.stop="emit('close')" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { rampSDK } from '@alchemy-pay/ramp-sdk'
import { useWeb3Const } from '@/utils/web3/base'
interface Props {
  address?: string
}
const props = withDefaults(defineProps<Props>(), {
  address: undefined
})
const env = 'PROD'
const emit = defineEmits(['close'])
onMounted(() => {
  rampInit(props.address)
})
function rampInit(address) {
  const ramp = new rampSDK({
    appId: useWeb3Const().alchemyPay.appId, // (Required)
    secret: useWeb3Const().alchemyPay.appSecret, // (Required)
    environment: env, // (Required)
    containerNode: 'rampView', // (Required) Dom node id
    optionalParameter: {
      crypto: 'SOL',
      network: 'SOL',
      address,
      merchantName: 'DUB'
    }
  })

  // Initialization Ramp SDK
  ramp.init()

  ramp.on('*', cb => {
    console.log('cb:', cb)
    // Destroy Ramp SDK
    if (cb.eventName === 'RAMP_WIDGET_CLOSE') {
      ramp.close()
      emit('close')
    } else {
      ramp.close()
      emit('close')
    }
  })
}
</script>

<style lang="less" scoped>
.pay-wrap {
  background-color: #fff;
  z-index: 1001;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .close-btn {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
  .pay-box {
    width: 100%;
    height: 100%;
    padding-top: 30px;
    :deep(iframe) {
      border: 0 none !important;
    }
  }
}
</style>
