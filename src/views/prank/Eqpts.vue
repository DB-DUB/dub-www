<template>
  <div class="equip-eggs">
    <div
      v-if="useEqptStore().currentEqpt != null"
      class="current-egg"
      :class="[`G${useEqptStore().currentEqpt?.grade}`]"
    >
      <img :src="getThumbnail(useEqptStore().currentEqpt?.url || '')" class="current-url" />
      <img
        src="@/assets/equipment/current-egg.png"
        class="current-egg"
      />
    </div>
    <div class="swiper-eggs">
      <swiper
        :slides-per-view="4"
        :space-between="9"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        class="swiper"
        effect="fade"
      >
        <swiper-slide v-for="item in eqptsList" class="swiper-slide">
          <div class="swiper-slide-inner" :class="[`E${item?.grade}`]" 
      @click="props.showDetail(item)">
            <img :src="getThumbnail(item?.url|| '')" class="egg-url" v-if="item?.id !== '-1'" />
            <img
              src="@/assets/equipment/eqpt-empty.png"
              class="egg-empty"
              v-if="item?.id === '-1'"
            />
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="text-wrap">
      Prank your friends,
      <br />earn <span class="prank-text"> $DUB </span>tokens.
    </div>
    <div class="share-wrap">
      <Button class="share-btn" title="Go to prank" @click="sharePrank"></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import 'swiper/less'
import { useEqptStore } from '@/stores/modules/eqpt'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/effect-fade'
import { EquipmentModel } from '@/api/model/equipment'
import { usePrankStore } from '@/stores/modules/prank'
import { getThumbnail } from '@/utils/file-helper'


interface Props {
  // Sharing methods
  sharePrank: () => void
  // Method for displaying equipment details
  showDetail: (eqpt: EquipmentModel) => void
  // How to modify the current displayed equipment
  onChange: (equip: EquipmentModel) => void
}

const props = withDefaults(defineProps<Props>(), {})

const eqptStore = useEqptStore()

const showEqpt = computed(() => {
  if (usePrankStore().currentShowEqpt != null) {
    return usePrankStore().currentShowEqpt
  } else if (useEqptStore().currentEqpt != null) {
    return useEqptStore().currentEqpt
  } else {
    return null
  }
})

/** all equipment（2.0+3.0） */
const eqptsList = computed(() => {
  if (eqptStore.eqptList == null || (eqptStore.eqptList && eqptStore.eqptList.length < 5)) {
    const len = 5 - eqptStore.eqptList.length
    const arr = new Array(len).fill({ id: '-1', level: -1 })
    return eqptStore.eqptList.concat(arr)
  }
  return eqptStore.eqptList
})
// The following two are the treatments related to the switcher, which can be adjusted as needed
const onSwiper = swiper => {
  console.log(swiper)
}
const onSlideChange = () => {
  console.log('slide change')
}
</script>

<style lang="less" scoped>
.equip-eggs {
  display: flex;
  margin-top: 1.1rem;
  padding-top: 7rem;
  padding-left: 3rem;
  flex-direction: column;
  align-items: center;

  .current-egg {
    width: 13.2rem;
    height: 13.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-right: 3.1rem;

    &.G1 {
      border: 8px solid transparent;
      border-image: url('@/assets/border/white-1.svg') 8 fill stretch;
    }

    &.G2 {
      border: 8px solid transparent;
      border-image: url('@/assets/border/blue-1.svg') 8 fill stretch;
    }

    &.G3 {
      border: 10px solid transparent;
      border-image: url('@/assets/border/purple-2.svg') 10 fill stretch;
    }

    &.G4 {
      border: 12px solid transparent;
      border-image: url('@/assets/border/yellow-2.svg') 12 fill stretch;
    }

    &.G5 {
      border: 12px solid transparent;
      border-image: url('@/assets/border/red-2.svg') 12 fill stretch;
    }

    .current-url {
      width: 11.8rem;
      height: 11.8rem;
    }

    .current-egg {
      width: 3.6rem;
      height: 3.6rem;
      position: absolute;
      left: 9.7rem;
      top: 9.7rem;
    }
  }

  .swiper-eggs {
    margin-top: 2.4rem;
    width: 100%;
    height: 7.2rem;

    .swiper {
      z-index: 0;
      width: 100%;
      padding-right: 3rem;

      .swiper-slide {
        .swiper-slide-inner {
          width: 7.2rem;
          height: 7.2rem;
          margin-right: 0.9rem;
          display: flex;
          justify-content: center;
          align-items: center;

          &.E1 {
            border: 8px solid transparent;
            border-image: url('@/assets/border/white-1.svg') 8 fill stretch;
          }

          &.E2 {
            border: 8px solid transparent;
            border-image: url('@/assets/border/blue-1.svg') 8 fill stretch;
          }

          &.E3 {
            border: 10px solid transparent;
            border-image: url('@/assets/border/purple-2.svg') 10 fill stretch;
          }

          &.E4 {
            border: 12px solid transparent;
            border-image: url('@/assets/border/yellow-2.svg') 12 fill stretch;
          }

          &.E5 {
            border: 12px solid transparent;
            border-image: url('@/assets/border/red-2.svg') 12 fill stretch;
          }

          .egg-url {
            width: 6rem;
            height: 6rem;
          }

          .egg-empty {
            width: 7.2rem;
            height: 7.2rem;
          }
        }
      }
    }
  }

  .text-wrap {
    margin-top: 5.5rem;
    font-size: 2.6rem;
    line-height: 4rem;
    color: #ffffff;
    font-family: PixeloidSans-Bold;

    .prank-text {
      color: #ffd63e;
    }
  }

  .share-wrap {
    margin-top: 1.6rem;
    height: 5.5rem;
    width: 100%;
    margin-right: 3.1rem;

    .share-btn {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
