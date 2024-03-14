<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="merge-info-container"
      :class="[`OV${useModalStore().equipmentInfoModal.visible ? 0 : 1}`]"
    >
      <div class="blur-bg"></div>
      <div class="merge-info-wrap">
        <div class="merge-top-wrap">
          <div class="close-wrap" @click="pubSubUtil.emit(SubName.CloseMergeEqpt)">
            <img class="close-icon" src="@/assets/close-icon.svg" alt="" />
          </div>
          <span class="title">Merge Eggs</span>
          <div class="merge-wrap">
            <div class="merge-item-wrap">
              <div
                v-if="mergeEqptList.length >= 1"
                class="merge-item"
                :class="[`G${mergeEqptList[0].grade}`]"
              >
                <img
                  @click="openEquipmentInfo(mergeEqptList[0])"
                  class="merge-item-img"
                  :src="getThumbnail(mergeEqptList[0].url)"
                />
                <img
                  v-if="mergeEqptList.length >= 1"
                  @click="chooseForMerge(mergeEqptList[0])"
                  class="merge-cancel"
                  src="@/assets/equipment/merge-cancel.png"
                />
              </div>
              <img
                v-if="mergeEqptList.length < 1"
                class="merge-item-empty"
                src="@/assets/equipment/eqpt-empty.png"
              />
            </div>
            <div class="merge-item-wrap">
              <div
                v-if="mergeEqptList.length >= 2"
                class="merge-item"
                :class="[`G${mergeEqptList[1].grade}`]"
              >
                <img
                  @click="openEquipmentInfo(mergeEqptList[1])"
                  class="merge-item-img"
                  :src="getThumbnail(mergeEqptList[1].url)"
                />
                <img
                  v-if="mergeEqptList.length >= 1"
                  @click="chooseForMerge(mergeEqptList[1])"
                  class="merge-cancel"
                  src="@/assets/equipment/merge-cancel.png"
                />
              </div>
              <img
                v-if="mergeEqptList.length < 2"
                class="merge-item-empty"
                src="@/assets/equipment/eqpt-empty.png"
              />
            </div>
            <div class="merge-item-wrap">
              <div
                v-if="mergeEqptList.length >= 3"
                class="merge-item"
                :class="[`G${mergeEqptList[2].grade}`]"
              >
                <img
                  @click="openEquipmentInfo(mergeEqptList[2])"
                  class="merge-item-img"
                  :src="getThumbnail(mergeEqptList[2].url)"
                />
                <img
                  v-if="mergeEqptList.length >= 2"
                  @click="chooseForMerge(mergeEqptList[2])"
                  class="merge-cancel"
                  src="@/assets/equipment/merge-cancel.png"
                />
              </div>
              <img
                v-if="mergeEqptList.length < 3"
                class="merge-item-empty"
                src="@/assets/equipment/eqpt-empty.png"
              />
            </div>
            <div>
              <div
                v-if="mergeEqptList.length >= 4"
                class="merge-item"
                :class="[`G${mergeEqptList[3].grade}`]"
              >
                <img
                  @click="openEquipmentInfo(mergeEqptList[3])"
                  class="merge-item-img"
                  :src="getThumbnail(mergeEqptList[3].url)"
                />
                <img
                  v-if="mergeEqptList.length >= 4"
                  @click="chooseForMerge(mergeEqptList[3])"
                  class="merge-cancel"
                  src="@/assets/equipment/merge-cancel.png"
                />
              </div>
              <img
                v-if="mergeEqptList.length < 4"
                class="merge-item-empty"
                src="@/assets/equipment/eqpt-empty.png"
              />
            </div>
          </div>
          <div class="merge-btn-wrap">
            <Button
              @click="mergeEqpt()"
              :loading="isMergeLoading"
              :disabled="mergeEqptList.length < 2"
              title="Merge"
            ></Button>
          </div>
          <div class="merge-rule">
            <span class="display-block">
              When you merge eggs, there's a 50% chance of getting a better egg and a 1% chance of
              getting a much better egg.
            </span>
          </div>
        </div>
        <div class="eqpt-list scrollbar">
          <div
            v-for="(eqpt, index) in useEqptStore().eqptListForMerge"
            :key="eqpt.equip_id"
            class="eqpt-item"
            :class="[`D${canMerge(eqpt) || isChoose(eqpt) ? 1 : 0}`, `R${index % 4 === 3 ? 0 : 1}`]"
          >
            <div class="merge-item" :class="[`G${eqpt.grade}`]">
              <img
                @click="openEquipmentInfo(eqpt)"
                class="merge-item-img"
                :src="getThumbnail(eqpt.url)"
              />
              <img
                @click="chooseForMerge(eqpt)"
                v-if="isChoose(eqpt)"
                class="eqpt-select"
                src="@/assets/equipment/merge-select.png"
              />
              <img
                @click="chooseForMerge(eqpt)"
                v-if="!isChoose(eqpt)"
                class="eqpt-select"
                src="@/assets/equipment/merge-unselect.png"
              />
            </div>
            <span class="eqpt-name" :class="[`G${eqpt.grade}`]">{{
              useEqptNameV2(eqpt.grade)
            }}</span>
            <span class="eqpt-level" :class="[`G${eqpt.grade}`]">Lv {{ eqpt.level }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script setup lang="ts">
import { EquipmentGrade, EquipmentModel } from '@/api/model/equipment'
import { useEqptStore } from '@/stores/modules/eqpt'
import { useEqptNameV2 } from '@/utils/eqptUtil'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { SubName, pubSubUtil } from '@/utils/pub-sub'
import { getThumbnail } from '@/utils/file-helper'
import { useModalStore } from '@/stores/modules/modal'
interface Props {
  visible?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  visible: false
})
const mergeEqptList = ref<EquipmentModel[]>([])
const emit = defineEmits(['update:visible'])
const isMergeLoading = ref(false)
let watchVisible, subEquipEggKey, subMintEggKey
onMounted(() => {
  watchVisible = watch(
    () => props.visible,
    () => {
      if (!props.visible) {
        mergeEqptList.value = []
        isMergeLoading.value = false
      }
    }
  )
  subEquipEggKey = pubSubUtil.on(SubName.EquipEgg, eqpt => {
    mergeEqptList.value = mergeEqptList.value.filter(i => i.equip_id !== eqpt.equip_id)
  })
  subMintEggKey = pubSubUtil.on(SubName.MintEgg, eqpt => {
    mergeEqptList.value = mergeEqptList.value.filter(i => i.equip_id !== eqpt.equip_id)
  })
})

onUnmounted(() => {
  watchVisible && watchVisible()
  subEquipEggKey && pubSubUtil.off(subEquipEggKey)
  subMintEggKey && pubSubUtil.off(subMintEggKey)
})

function chooseForMerge(eqpt: EquipmentModel) {
  if (isMergeLoading.value) {
    return
  }
  const fixList = mergeEqptList.value.slice()
  if (isChoose(eqpt)) {
    mergeEqptList.value = fixList.filter(i => i.id !== eqpt.id)
  } else if (canMerge(eqpt)) {
    fixList.push(eqpt)
    mergeEqptList.value = fixList
  }
}
function isChoose(eqpt: EquipmentModel) {
  return mergeEqptList.value.findIndex(i => i.id === eqpt.id) >= 0
}
function canMerge(eqpt: EquipmentModel) {
  const len = mergeEqptList.value.length
  if (len > 0 && mergeEqptList.value[0].grade === EquipmentGrade.G5) {
    return len < 2
  }
  if (len >= 0 && len <= 3) {
    if (len === 0 || mergeEqptList.value[0].grade === eqpt.grade) {
      return true
    }
  }
  return false
}

function openEquipmentInfo(eqpt: EquipmentModel) {
  pubSubUtil.emit(SubName.OpenEquipmentInfo, {
    eqptList: useEqptStore().eqptListForMerge,
    defaultEqptId: eqpt.equip_id
  })
}

function mergeEqpt() {
  if (isMergeLoading.value) {
    return
  }
  isMergeLoading.value = true
  const mergeEqptParams = mergeEqptList.value.slice()
  useEqptStore()
    .merge(mergeEqptParams)
    .then(eqpt => {
      isMergeLoading.value = false
      pubSubUtil.emit(SubName.MergeEqptResult, {
        isSuccess: true,
        params: mergeEqptParams,
        result: eqpt
      })
    })
    .catch(_e => {
      isMergeLoading.value = false
      pubSubUtil.emit(SubName.MergeEqptResult, { isSuccess: false })
    })
}
</script>
<style lang="less" scoped>
@import '@/styles/constant';
.merge-info-container {
  position: fixed;
  top: 2rem;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  &.OV1 {
    overflow-y: auto;
  }
  &.OV2 {
    overflow-y: none;
  }
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

  .merge-info-wrap {
    position: relative;
    height: 55rem;
    z-index: 1;
    border: 8px solid transparent;
    border-image: url('@/assets/border/purple-2.svg') 8 fill stretch;
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
    .merge-top-wrap {
      z-index: 1;
      .title {
        font-family: PixeloidSans-Bold;
        font-size: 2.2rem;
        line-height: 4rem;
        color: #ffffff;
        margin-top: 1.7rem;
        margin-left: 3.65rem;
      }
      .merge-wrap {
        width: 33rem;
        height: 7.2rem;
        margin-top: 1.3rem;
        margin-left: 0.95rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
      }
      .merge-item-wrap {
        margin-right: 0.9rem;
      }
      .merge-item-empty {
        width: 7.2rem;
        height: 7.2rem;
      }
      .merge-cancel {
        position: absolute;
        top: 5.1rem;
        right: -0.8rem;
        width: 1.8rem;
        height: 1.8rem;
      }
      .merge-btn-wrap {
        margin-top: 2rem;
        margin-left: 2.65rem;
        width: 28.4rem;
      }
      .merge-rule {
        margin-top: 1.2rem;
        margin-left: 2.65rem;
        width: 29.4rem;
        font-family: PixeloidSans;
        font-size: 1.2rem;
        line-height: 1.8rem;
        color: #869aa9;
        .display-block {
          display: block;
        }
      }
    }
    .eqpt-list {
      width: 33rem;
      height: 22.8rem;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      overflow-x: hidden;
      overflow-y: auto;
      margin-top: 2rem;
      margin-left: 0.95rem;
      justify-content: flex-start;
      .eqpt-item {
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
        &.R1 {
          margin-right: 0.9rem;
        }
        &.D1 {
          filter: none;
        }
        &.D0 {
          filter: brightness(0.5);
        }
        .eqpt-name,
        .eqpt-level {
          font-family: PixeloidSans;
          font-size: 1.2rem;
          line-height: 1.4rem;
          &.G1 {
            color: #ffffff;
          }
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
        .eqpt-select {
          position: absolute;
          top: 5rem;
          right: -0.8rem;
          width: 1.8rem;
          height: 1.8rem;
        }
      }
    }
    .merge-item {
      width: 7.2rem;
      height: 7.2rem;
      flex: 0 0 auto;
      border: 8px solid transparent;
      position: relative;
      display: flex;
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
      .merge-item-img {
        width: 6rem;
        height: 6rem;
      }
    }
  }
}
</style>
