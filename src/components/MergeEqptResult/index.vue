<template>
  <transition name="fade">
    <div v-if="visible" class="merge-result-container">
      <div class="blur-bg"></div>
      <div
        class="merge-result-wrap"
        :class="[`L${isSuccess ? params?.length : -1}`, `G${isSuccess ? result?.grade : -1}`]"
      >
        <div class="close-wrap" @click="pubSubUtil.emit(SubName.CloseMergeEqptResult)">
          <img class="close-icon" src="@/assets/close-icon.svg" alt="" />
        </div>
        <div class="title-wrap">
          <img v-if="!isSuccess" class="title-icon" src="@/assets/equipment/merge-result-t1.png" />
          <img
            v-if="isSuccess && result?.grade !== EquipmentGrade.G5"
            class="title-icon"
            src="@/assets/equipment/merge-result-t2.png"
          />
          <img
            v-if="isSuccess && result?.grade === EquipmentGrade.G5"
            class="title-icon"
            src="@/assets/equipment/merge-result-t3.png"
          />
        </div>
        <div class="txt-wrap">
          <span v-if="isSuccess" class="txt">Merge successful</span>
          <span v-if="!isSuccess" class="txt">Merge failed.</span>
        </div>
        <div v-if="isSuccess" class="merge-wrap">
          <div class="from-wrap">
            <div v-for="eqpt in params" :key="eqpt.id" class="eqpt-item">
              <div class="eqpt-img-wrap" :class="[`G${eqpt.grade}`]">
                <img class="eqpt-img" :src="getThumbnail(eqpt.url)" />
              </div>
              <span v-if="params != null && params.length <= 2" class="eqpt-name">{{
                useEqptNameV2(eqpt.grade)
              }}</span>
              <span v-if="params != null && params.length <= 2" class="eqpt-level"
                >Lv {{ eqpt.level }}</span
              >
            </div>
          </div>
          <img class="merge-to-img" src="@/assets/equipment/merge-to.png" />
          <div class="to-wrap">
            <div class="eqpt-item">
              <div class="eqpt-img-wrap" :class="[`G${result?.grade}`]">
                <img class="eqpt-img" :src="getThumbnail(result?.url || '')" />
              </div>
              <span v-if="params != null && params.length <= 2" class="eqpt-name">{{
                useEqptNameV2(result?.grade)
              }}</span>
              <span v-if="params != null && params.length <= 2" class="eqpt-level"
                >Lv {{ result?.level }}</span
              >
              <div v-if="params != null && params.length > 2" class="eqpt-result-desp">
                <span class="eqpt-name" :class="[`G${result?.grade}`]">{{
                  useEqptNameV2(result?.grade)
                }}</span>
                <span class="eqpt-level" :class="[`G${result?.grade}`]"
                  >Lv {{ result?.level }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { EquipmentGrade, EquipmentModel } from '@/api/model/equipment'
import { useEqptNameV2 } from '@/utils/eqptUtil'
import { getThumbnail } from '@/utils/file-helper'
import { SubName, pubSubUtil } from '@/utils/pub-sub'

interface Props {
  visible?: boolean
  isSuccess?: boolean
  params?: EquipmentModel[]
  result?: EquipmentModel
}
withDefaults(defineProps<Props>(), {
  visible: false
})
const emit = defineEmits(['update:visible'])
</script>
<style lang="less" scoped>
@import '@/styles/constant';
.merge-result-container {
  position: fixed;
  top: 0rem;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  .blur-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
  .merge-result-wrap {
    position: relative;
    width: 33.5rem;
    z-index: 1;
    border: 8px solid transparent;
    &.L-1 {
      height: 18.6rem;
    }
    &.L1,
    &.L2 {
      height: 28rem;
    }
    &.L3,
    &.L4 {
      height: 33rem;
    }
    &.G-1 {
      border-image: url('@/assets/border/silver-2.svg') 8 fill stretch;
    }
    &.G1,
    &.G2,
    &.G3,
    &.G4 {
      border-image: url('@/assets/border/purple-2.svg') 8 fill stretch;
    }
    &.G5 {
      border-image: url('@/assets/border/red-2.svg') 8 fill stretch;
    }

    .close-wrap {
      padding: 1.4rem;
      position: absolute;
      top: 0;
      right: 0;
      .close-icon {
        width: 1rem;
        height: 1rem;
      }
    }
    .title-wrap {
      position: absolute;
      top: -6rem;
      right: 12.5rem;
      .title-icon {
        width: 8.4rem;
        height: 10.8rem;
      }
    }
    .txt-wrap {
      font-family: PixeloidSans-Bold;
      font-size: 2.2rem;
      line-height: 3.2rem;
      color: #ffffff;
      margin-top: 6.6rem;
      display: flex;
      justify-content: center;
      .txt {
        display: block;
      }
    }
    .merge-wrap {
      margin-top: 3.3rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .from-wrap {
        width: 15rem;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-around;
      }
      .merge-to-img {
        width: 1.4rem;
        height: 1.4rem;
        margin-left: 2.2rem;
        margin-right: 2.1rem;
      }
      .to-wrap {
        position: relative;
        .eqpt-result-desp {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          top: 7.2rem;
        }
      }
      .eqpt-item {
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 0.6rem;
        .eqpt-img-wrap {
          width: 7.2rem;
          height: 7.2rem;
          border: 8px solid transparent;
          display: flex;
          flex: 0 0 auto;
          justify-content: center;
          align-items: center;
          &.G1 {
            border-image: url('@/assets/border/white-1.svg') 8 fill stretch;
          }
          &.G2 {
            border-image: url('@/assets/border/blue-1.svg') 8 fill stretch;
          }
          &.G3 {
            border-image: url('@/assets/border/purple-2.svg') 8 fill stretch;
          }
          &.G4 {
            border-image: url('@/assets/border/yellow-2.svg') 8 fill stretch;
          }
          &.G5 {
            border-image: url('@/assets/border/red-2.svg') 8 fill stretch;
          }
        }
        .eqpt-img {
          width: 6rem;
          height: 6rem;
        }
        .eqpt-name,
        .eqpt-level {
          font-family: PixeloidSans;
          font-size: 1.2rem;
          line-height: 1.4rem;
          color: #ffffff;
          &.G2 {
            color: #28a2ff;
          }
          &.G3 {
            color: #787dff;
          }
          &.G4 {
            color: #ffd83e;
          }
          &.G5 {
            color: #ff1717;
          }
        }
        .eqpt-name {
          margin-top: 0.5rem;
        }
        .eqpt-level {
          margin-top: 0.1rem;
        }
      }
    }
  }
}
</style>
