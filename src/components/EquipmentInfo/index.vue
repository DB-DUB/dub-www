<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="equipment-info-container"
      @click="attributesRef.updateShowTipKey('')"
    >
      <div class="blur-bg"></div>
      <div class="equipment-info-wrap">
        <div class="equipment-info-border" :class="[`G${equipmentInfo.grade}`]"></div>
        <div class="equipment-info-content">
          <div class="close-wrap" @click="onClose()">
            <img class="close-icon" src="@/assets/close-icon.svg" alt="" />
          </div>
          <div class="equipment-wrap">
            <div class="equipment-top-wrap">
              <img
                v-if="equipments.length > 1"
                class="arrow-left"
                src="@/assets/equipment/arrow-left.png"
                @click="updateIndex('previous')"
              />
              <div class="equipment-img-wrap" :class="[`G${equipmentInfo.grade}`]">
                <img :src="getThumbnail(equipmentInfo.url)" alt="" />
              </div>
              <img
                v-if="equipments.length > 1"
                class="arrow-right"
                src="@/assets/equipment/arrow-left.png"
                @click="updateIndex('next')"
              />
            </div>
            <div class="equipment-name" :style="{ color: themeColor }">
              {{ useEqptName(equipmentInfo.grade)
              }}<span class="level">{{ `Lv.${equipmentInfo.level}` }}</span>
            </div>
            <div class="equipment-slogan">{{ `Pranking is as easy as breathing for you.` }}</div>
          </div>

          <!--attribute value-->
          <Attributes ref="attributesRef" :info="equipmentInfo" :theme-color="themeColor" />

          <div
            class="lol-wrap"
            v-if="equipmentInfo.grade !== EquipmentGrade.G1 && equipmentInfo.level < 10"
          >
            <div class="lol-title-wrap">
              <div class="lol-title">$LOL</div>
              <div class="lol-value">
                {{ `${commonShortNumberFormat(userLol)}/${useEqptUpradeLol(equipmentInfo)}` }}
              </div>
            </div>
            <LolProgressBar :progress="lolProgress" />
          </div>

          <div class="durability-wrap">
            <div class="durability-value">
              {{ `Durability` }}<span>{{ equipmentInfo.durability }}</span
              >{{ `/${equipmentInfo.durability_max}` }}
            </div>
            <div class="btn-wrap">
              <Button
                v-if="!!equipmentInfo.id"
                title="Repair"
                size="mini"
                :disabled="equipmentInfo.durability === equipmentInfo.durability_max"
                @click="onRepair"
                :loading="loading.repair"
              />
            </div>
          </div>
          <div class="equip-upgrade-button-wrap">
            <Button
              :disabled="equipmentInfo.wear_status === EquipStatus.Equipped"
              :title="equipmentInfo.wear_status === EquipStatus.Equipped ? 'Equipped' : 'Equip'"
              theme="white"
              @click="onEquip"
              :loading="loading.equip"
            />
            <!--Baby Egg can't Upgrade-->
            <Button
              v-if="
                !!equipmentInfo.id &&
                equipmentInfo.grade !== EquipmentGrade.G1 &&
                equipmentInfo.level < 10
              "
              :disabled="lolProgress < 100"
              title="Upgrade"
              :sub-title="upgradeChance"
              theme="white"
              @click="onUpgrade"
              :loading="loading.upgrade"
              :badge="lolProgress === 100"
            />
          </div>
          <!--Baby Egg can't Mint-->
          <Button
            class="mint-btn"
            v-if="!!equipmentInfo.id && equipmentInfo.grade !== EquipmentGrade.G1"
            :disabled="equipmentInfo.wear_status === EquipStatus.Equipped"
            title="Mint"
            @click="onMint"
            :loading="loading.mint"
          />
        </div>
      </div>

      <Teleport to="body">
        <Modal
          v-model:show="modalData.visible"
          :title="modalData.title"
          @close="onModalClose"
          :loading="modalData.processing || modalData.loading"
        >
          <template #body>
            <div class="modal-content-wrap">
              <div v-if="!!modalData.customTitle" class="customTitle">
                {{ modalData.customTitle }}
              </div>
              <div v-if="modalData.showLol" class="lol-wrap">
                <div class="value">
                  {{ commonShortNumberFormat(Number(modalData.lol)) }}<span>{{ `LOL` }}</span>
                </div>
                <div class="balance">
                  {{ 'Balance:' }}<span>{{ commonShortNumberFormat(userLol) }}</span
                  >{{ 'LOL' }}
                </div>
              </div>

              <div v-if="modalData.showSol" class="sol-wrap">
                <div class="balance">
                  {{ 'Balance:'
                  }}<span>{{ commonShortNumberFormat(Number(modalData.solBalance)) }}</span
                  >{{ 'SOL' }}
                </div>
                <div class="gas">{{ `Gas ≈ ${modalData.solGas} SOL` }}</div>
              </div>
            </div>
          </template>

          <template #footer>
            <Button
              v-if="!modalData.processing"
              :loading="modalData.loading"
              :title="modalData.btnStr"
              @click="modalData.onConfirm"
            />
            <Button
              class="processing"
              v-if="modalData.processing"
              :loading="true"
              type="hollow"
              title="Processing blockchain…"
            />
          </template>
        </Modal>
      </Teleport>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { EquipmentGrade, EquipmentModel, EquipStatus } from '@/api/model/equipment'
import Button from '@/components/Button/index.vue'
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { getFixDurabilityAmount } from '@/api/equipment'
import Modal from '@/components/Modal/index.vue'
import ToastManager from '@/components/Toast/ToastManager'
import { commonModal } from '@/components/Modal/index'
import { useEqptStore } from '@/stores/modules/eqpt'
import { useEqptName, useEqptUpradeLol } from '@/utils/eqptUtil'
import { preBurnEqpt } from '@/api/web3'
import { Web3Error } from '@/api/model/web3'
import dayjs from 'dayjs'
import { commonShortNumberFormat } from '@/utils/filter/number'
import { handleWeb3Error } from '@/utils/web3/base'
import { getThumbnail } from '@/utils/file-helper'
import { pubSubUtil, SubName } from '@/utils/pub-sub'
import { ErrorCodeEnum } from '@/api/model/enums'

const userStore = useUserStore()

interface Props {
  visible?: boolean
  /**datasource from useEqptStore*/
  equipments: EquipmentModel[]
  defaultId: string //Equip id
}
const props = withDefaults(defineProps<Props>(), {
  visible: false
})

const emit = defineEmits(['update:visible'])

const currentEqptId = ref(props.defaultId)
/***
 *current equipment
 */
const equipmentInfo = computed(() => {
  const array = props.equipments.filter(item => item.equip_id === currentEqptId.value)
  return array[0]
})

const upgradeChanceArray = [100, 100, 100, 90, 80, 70, 70, 60, 60, 50]
const upgradeChance = computed(() => {
  return `Chance ${upgradeChanceArray[equipmentInfo.value.level]}%`
})

watch(
  () => props.visible,
  () => {
    if (props.visible) {
      currentEqptId.value = props.defaultId
    }
  }
)

/**update current show equipment*/
watch(
  () => currentEqptId.value,
  () => {
    initLoadingValues()
  }
)

const updateIndex = (type: 'previous' | 'next') => {
  let index = props.equipments.findIndex(item => item.equip_id === currentEqptId.value)
  if (type === 'previous') {
    if (index === 0) {
      index = props.equipments.length - 1
    } else {
      index--
    }
  } else {
    if (index === props.equipments.length - 1) {
      index = 0
    } else {
      index++
    }
  }
  currentEqptId.value = props.equipments[index].equip_id
}

const onClose = () => {
  pubSubUtil.emit(SubName.CloseEquipmentInfo)
}

/**
 *Fix Durability
 */
const onRepair = () => {
  /***
   *fix request
   */
  const fix = () => {
    modalData.value.loading = true
    useEqptStore()
      .fix(equipmentInfo.value.id)
      .then(() => {
        ToastManager().showToast('Egg has Fixed', 'success')
        modalDataInit()
      })
      .catch(e => {
        modalData.value.loading = false
      })
  }

  loading.value.repair = true
  /**Amount*/
  getFixDurabilityAmount({ id: equipmentInfo.value.id })
    .then(resp => {
      modalData.value = {
        visible: true,
        title: 'Repair Egg',
        btnStr: 'Fix now',
        showLol: true,
        lol: resp.amount,
        onConfirm: () => {
          if (userLol.value < resp.amount) {
            ToastManager().showToast('Not enough balance')
          } else {
            fix()
          }
        }
      }
    })
    .catch(e => {
      //ALL error
    })
    .finally(() => {
      loading.value.repair = false
    })
}

const onEquip = () => {
  //token is 2.0
  if (equipmentInfo.value.id) {
    loading.value.equip = true
    useEqptStore()
      .wear(equipmentInfo.value)
      .then(() => {
        ToastManager().showToast('Egg equipped', 'success')
      })
      .catch(() => {
        //ALL error
      })
      .finally(() => {
        loading.value.equip = false
      })
  } else {
    //token is 3.0
    loading.value.equip = true
    preBurnEqpt(equipmentInfo.value.mint_address)
      .then(resp => {
        modalData.value = {
          visible: true,
          customTitle: 'This Egg is an NFT, you must transfer it to DUB to equip it. Continue?',
          btnStr: 'Equip now',
          showSol: true,
          solGas: resp.gas,
          solBalance: resp.sol,
          onConfirm: () => {
            modalData.value.processing = true
            useEqptStore()
              .burn(resp.tx, equipmentInfo.value)
              .then(res => {
                modalData.value.processing = false
                modalData.value.loading = true
                useEqptStore()
                  .wear(res)
                  .then(() => {
                    ToastManager().showToast('Egg has equiped', 'success')
                    modalDataInit()
                  })
                  .catch(() => {
                    modalData.value.loading = false
                  })
              })
              .catch(e => {
                modalData.value.processing = false
                handleWeb3Error(e)
              })
          }
        }
      })
      .catch(e => {
        //cooling-off period
        if (e.code === ErrorCodeEnum.EqptTradedAway) {
          ToastManager().showToast('Equip was traded away', 'error')
        } else if (e.code === ErrorCodeEnum.Web3Error && e.message === Web3Error.PreBurnEqptCheck) {
          const error_data = e.data
          //Hours
          const mint_duration = Math.ceil(error_data.mint_duration / 3600)
          const next_mint_time = dayjs(error_data.last_mint_time).add(error_data.mint_duration, 's')
          //Minutes
          const remaining = Math.ceil(dayjs(next_mint_time).diff(dayjs(), 's') / 60)

          commonModal.open({
            content: `${mint_duration}-hour equip lock after minting. ${remaining} minutes remaining.`,
            confirmText: 'OK'
          })
        } else {
          handleWeb3Error(e)
        }
      })
      .finally(() => {
        loading.value.equip = false
      })
  }
}

const attributesRef = ref()
/**Upgrade*/
const onUpgrade = () => {
  if (equipmentInfo.value.free_attribute > 0) {
    commonModal.open({
      content: `You have unused points. Please add all points before upgrading.`,
      confirmText: 'OK'
    })
    return
  }

  loading.value.upgrade = true
  useEqptStore()
    .upgrade(equipmentInfo.value.id)
    .then(resp => {
      if (resp.status === 1) {
        ToastManager().showToast('Egg has been upgraded', 'success')
      } else {
        ToastManager().showToast(
          `Upgrade failed. level rolled back by ${equipmentInfo.value.level}`
        )
        attributesRef.value.initAttrs()
      }
    })
    .catch(e => {})
    .finally(() => {
      loading.value.upgrade = false
    })
}

/**web2 transform web3*/
const onMint = () => {
  const mint = () => {
    modalData.value = {
      visible: true,
      customTitle:
        'Turning this egg into an NFT will make it unusable until you transfer it back. Continue?',
      btnStr: 'Mint now',
      onConfirm: () => {
        modalData.value.processing = true
        useEqptStore()
          .mint(equipmentInfo.value)
          .then(resp => {
            ToastManager().showToast('Egg minted', 'success')
            modalDataInit()
          })
          .catch(e => {
            modalData.value.processing = false
          })
      }
    }
  }

  if (equipmentInfo.value.free_attribute > 0) {
    commonModal.open({
      content: `You have unused points. Please add all points before minting.`,
      confirmText: 'OK'
    })
    return
  }

  //incomplete durability
  if (equipmentInfo.value.durability < equipmentInfo.value.durability_max) {
    loading.value.mint = true
    /**Amount*/
    getFixDurabilityAmount({ id: equipmentInfo.value.id })
      .then(resp => {
        modalData.value = {
          visible: true,
          customTitle:
            'Egg must have full durability before it can be minted as NFT. Please repair it first.',
          showLol: true,
          btnStr: 'Fix now',
          lol: resp.amount,
          onConfirm: () => {
            if (userLol.value < resp.amount) {
              ToastManager().showToast('Not enough balance')
            } else {
              fix()
            }
          }
        }
      })
      .catch(e => {})
      .finally(() => {
        loading.value.mint = false
      })

    /***
     *fix request
     */
    const fix = () => {
      modalData.value.loading = true
      useEqptStore()
        .fix(equipmentInfo.value.id)
        .then(() => {
          ToastManager().showToast('Egg has Fixed', 'success')
          modalDataInit()
          mint()
        })
        .catch(e => {
          modalData.value.loading = false
        })
    }
  } else {
    mint()
  }
}

/**loading values*/
const loading = ref({
  attribute: false,
  repair: false,
  equip: false,
  upgrade: false,
  mint: false
})
const initLoadingValues = () => {
  loading.value = {
    attribute: false,
    repair: false,
    equip: false,
    upgrade: false,
    mint: false
  }
}

/**user LOL*/
const userLol = computed(() => {
  return Number(userStore?.userInfo?.lol || 0)
})

/**LOL upgrade percentum*/
const lolProgress = computed(() => {
  return Math.min((userLol.value / useEqptUpradeLol(equipmentInfo.value)) * 100, 100)
})

const modalData = ref<{
  visible: boolean
  title?: string
  customTitle?: string
  showSol?: boolean
  solBalance?: number
  solGas?: number
  showLol?: boolean
  lol?: number
  onConfirm?: () => void
  loading?: boolean
  processing?: boolean
  btnStr?: string
}>({ visible: false })
const modalDataInit = () => {
  modalData.value = {
    visible: false,
    title: '',
    customTitle: '',
    showSol: false,
    solBalance: 0,
    solGas: 0,
    showLol: false,
    lol: 0,
    onConfirm: undefined,
    loading: false,
    processing: false,
    btnStr: ''
  }
}
const onModalClose = () => {
  modalDataInit()
}

/**main color*/
const themeColor = computed(() => {
  switch (equipmentInfo.value.grade) {
    case EquipmentGrade.G1:
      return '#FFFFFF'
    case EquipmentGrade.G2:
      return '#28A2FF'
    case EquipmentGrade.G3:
      return '#787DFF'
    case EquipmentGrade.G4:
      return '#FFD83E'
    case EquipmentGrade.G5:
      return '#FF1717'
  }
})
</script>

<style lang="less" scoped>
@import '@/styles/constant';
.equipment-info-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
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

  .equipment-info-wrap {
    position: relative;
    .equipment-info-border {
      z-index: 1;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border: 8px solid transparent;
      transition: all 0.2s;
      &.G1 {
        border-image: url('@/assets/border/white-2.svg') 8 fill stretch;
      }
      &.G2 {
        border-image: url('@/assets/border/blue-2.svg') 8 fill stretch;
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

    .equipment-info-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      width: 33.5rem;
      padding: 4.6rem 2rem 2.4rem;

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

      .equipment-wrap {
        display: flex;
        margin-bottom: 1.1rem;
        flex-direction: column;
        align-items: center;

        .equipment-top-wrap {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;

          .equipment-img-wrap {
            width: 13.2rem;
            height: 13.2rem;
            transition: all 0.2s;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            &.G1 {
              border: 8px solid transparent;
              border-image: url('@/assets/border/white-2.svg') 8 fill stretch;
            }
            &.G2 {
              border: 8px solid transparent;
              border-image: url('@/assets/border/blue-2.svg') 8 fill stretch;
            }
            &.G3 {
              border: 10px solid transparent;
              border-image: url('@/assets/border/purple-3.svg') 10 fill stretch;
            }
            &.G4 {
              border: 12px solid transparent;
              border-image: url('@/assets/border/yellow-4.svg') 12 fill stretch;
            }
            &.G5 {
              border: 12px solid transparent;
              border-image: url('@/assets/border/red-4.svg') 12 fill stretch;
            }
            img {
              position: absolute;
              width: 11.8rem;
              height: 11.8rem;
            }
          }

          .arrow-left {
            width: 3.6rem;
            height: 3.6rem;
            margin-right: 3rem;
          }

          .arrow-right {
            width: 3.6rem;
            height: 3.6rem;
            transform: rotate(180deg);
            margin-left: 3rem;
          }
        }
        .equipment-name {
          font-size: 1.4rem;
          line-height: 2.4rem;
          font-family: PixeloidSans-Bold;
          color: #28a2ff;
          margin-bottom: 0.2rem;
          transition: color 0.2s;
          .level {
            font-size: 1.2rem;
            font-family: PixeloidSans;
            margin-left: 0.5rem;
          }
        }

        .equipment-slogan {
          font-size: 1.4rem;
          line-height: 2rem;
          font-family: PixeloidSans;
          color: #ffffff;
          max-width: 20rem;
          text-align: center;
        }
      }

      .lol-wrap {
        margin-bottom: 1.9rem;
        .lol-title-wrap {
          font-family: PixeloidSans-Bold;
          font-size: 1.4rem;
          line-height: 2rem;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.3rem;
        }
      }

      .durability-wrap {
        display: flex;
        align-items: center;
        margin-bottom: 1.5rem;
        justify-content: space-between;
        min-width: 0;
        .durability-value {
          flex: 1;
          min-width: 0;
          font-size: 1.4rem;
          line-height: 2.4rem;
          font-family: PixeloidSans-Bold;
          span {
            margin-left: 0.9rem;
            color: @primaryColor;
          }
        }
      }

      .equip-upgrade-button-wrap {
        display: flex;
        align-items: center;

        .button-container + .button-container {
          margin-left: 0.7rem;
        }

        :deep(.button-container) {
          .button-content .loading-icon {
            left: -2.6rem;
          }
        }
      }

      .mint-btn {
        margin-top: 0.6rem;
      }
    }
  }
}

.btn-wrap {
  display: flex;
  align-items: center;
}

.modal-content-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  .customTitle {
    font-size: 1.4rem;
    line-height: 2rem;
  }

  .lol-wrap {
    margin-top: 2.6rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .value {
      color: #ffd83e;
      font-family: PixeloidSans-Bold;
      font-size: 2.6rem;
      line-height: 3.2rem;
      span {
        font-family: PixeloidSans;
        font-size: 1.4rem;
        line-height: 1.7rem;
        margin-left: 0.4rem;
      }
    }
    .balance {
      margin-top: 0.4rem;
      color: #b5bfc9;
      font-family: PixeloidSans;
      font-size: 1.4rem;
      line-height: 2rem;
      span {
        font-family: PixeloidSans-Bold;
        margin: 0 0.4rem;
      }
    }
  }

  .sol-wrap {
    margin-top: 2.6rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .balance {
      color: #ffffff;
      font-family: PixeloidSans;
      font-size: 1.8rem;
      line-height: 2.2rem;
      span {
        color: #ffd83e;
        font-family: PixeloidSans-Bold;
        margin: 0 0.4rem;
      }
    }
    .gas {
      color: #b5bfc9;
      font-family: PixeloidSans;
      font-size: 1.4rem;
      line-height: 2rem;
      margin-top: 0.6rem;
    }
  }
}

:deep(.common-modal-footer) {
  margin-top: 3rem;

  .button-container.processing {
    .loading-icon {
      position: relative;
      left: 0;
      margin-right: 1rem;
    }
    .title {
      font-size: 1.4rem;
      color: #787dff;
      font-family: PixeloidSans;
    }
  }
}
</style>
