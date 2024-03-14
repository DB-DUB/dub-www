<template>
  <div>
    <div class="eqpt-main">
      <div class="eqpt-list">
        <div v-for="eqpt in useEqptStore().eqptList" :key="eqpt.equip_id" class="eqpt-item">
          <div class="eqpt-item-wrap" :class="[`G${eqpt.grade}`]">
            <img @click="openEquipmentInfo(eqpt)" class="eqpt-img" :src="getThumbnail(eqpt.url)" />
            <img
              v-if="eqpt.wear_status === EquipStatus.Equipped"
              class="eqpt-current"
              src="@/assets/equipment/current-egg.png"
            />
            <img
              v-if="
                !isEqpt3(eqpt) &&
                eqpt.grade !== EquipmentGrade.G1 &&
                eqpt?.level < 10 &&
                Number(useUserStore().userInfo?.lol) >= useEqptUpradeLol(eqpt)
              "
              class="eqpt-upgrade"
              src="@/assets/equipment/upgrade-icon.png"
            />
          </div>
          <span class="eqpt-name" :class="[`G${eqpt.grade}`]">{{ useEqptNameV2(eqpt.grade) }}</span>
          <span class="eqpt-level" :class="[`G${eqpt.grade}`]">Lv {{ eqpt.level }}</span>
        </div>
      </div>
    </div>
    <div class="eqpt-bottom-wrap">
      <Button @click="merge" title="Merge" size="large" type="hollow"></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { EquipStatus, EquipmentGrade, EquipmentModel } from '@/api/model/equipment'
import { isEqpt3, useEqptNameV2, useEqptUpradeLol } from '@/utils/eqptUtil'
import { useEqptStore } from '@/stores/modules/eqpt'
import { SubName, pubSubUtil } from '@/utils/pub-sub'
import { useUserStore } from '@/stores/modules/user'
import { getThumbnail } from '@/utils/file-helper'

let subMergeEqptResultKey
onMounted(() => {
  subMergeEqptResultKey = pubSubUtil.on(SubName.MergeEqptResult, evt => {
    pubSubUtil.emit(SubName.CloseMergeEqpt)
    const { isSuccess, params, result } = evt
    pubSubUtil.emit(SubName.OpenMergeEqptResult, { isSuccess, params, result })
  })
})
onUnmounted(() => {
  subMergeEqptResultKey && pubSubUtil.off(subMergeEqptResultKey)
})

function openEquipmentInfo(eqpt: EquipmentModel) {
  pubSubUtil.emit(SubName.OpenEquipmentInfo, {
    eqptList: useEqptStore().eqptList,
    defaultEqptId: eqpt.equip_id
  })
}

function merge() {
  pubSubUtil.emit(SubName.OpenMergeEqpt)
}
</script>

<style lang="less" scoped>
.eqpt-main {
  margin-top: 4.1rem;
}
.eqpt-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 3rem;
  margin-bottom: 9.6rem;
  .eqpt-item {
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 0.9rem;
    margin-bottom: 1rem;
    .eqpt-item-wrap {
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
    .eqpt-current {
      position: absolute;
      top: 6rem;
      right: -0.5rem;
      width: 1.8rem;
      height: 1.8rem;
    }
    .eqpt-upgrade {
      position: absolute;
      top: -0.5rem;
      right: -0.5rem;
      width: 1.8rem;
      height: 1.8rem;
    }
  }
}
.eqpt-bottom-wrap {
  position: fixed;
  bottom: 7.4rem;
  bottom: calc(7.4rem + constant(safe-area-inset-bottom));
  bottom: calc(7.4rem + env(safe-area-inset-bottom));
  left: 0;
  background-image: url('@/assets/equipment/eqpt-bottom-mask.png');
  background-size: cover;
  width: 100%;
  height: 9.6rem;
  padding-left: 3.2rem;
  padding-right: 3.1rem;
  padding-top: 2.2rem;
}
</style>
