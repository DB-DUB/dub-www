<template>
  <div class="main">
    <div class="equip-info">
      <div class="equip-left" :class="[`G${useEqptStore().currentEqpt?.grade}`]" @click="showDetail(useEqptStore().currentEqpt)">
        <img :src="getThumbnail(useEqptStore().currentEqpt?.url || '')" class="current-url" />
        <img
          src="@/assets/equipment/current.png"
          class="equip-current"
          v-if="useEqptStore().currentEqpt?.wear_status === EquipStatus.Equipped"
        />
      </div>
      <div class="equip-right">
        <div class="equip-info-wrap power">
          <span class="equip-title">Power</span>
          <span class="equip-content">{{ useEqptStore().currentEqpt?.power }}</span>
        </div>
        <!-- Critical hit rate  -->
        <div class="equip-info-wrap">
          <span class="equip-title">Crit rate</span>
          <span class="equip-content">{{ crit }}%</span>
        </div>
        <img class="line" src="@/assets/prank/line.png" />
        <div class="equip-info-wrap">
          <span class="equip-title" :class="getTextColor(useEqptStore().currentEqpt?.durability)"
            >Durability</span
          >
          <span
            class="equip-content"
            :class="getTextColor(useEqptStore().currentEqpt?.durability)"
            >{{ useEqptStore().currentEqpt?.durability }}</span
          >
        </div>
        <div class="equip-info-wrap">
          <span class="equip-title" :class="getTextColor(userInfo?.physical)">Stamina</span>
          <span class="equip-content" :class="getTextColor(userInfo?.physical)">{{
            userInfo?.physical
          }}</span>
        </div>
      </div>
    </div>
    <!-- ToDo Share the entire process -->
    <Button class="prank-btn" title="Go to prank" @click="props.sharePrank"></Button>
    <!-- question bank -->
    <div class="question-bank" v-if="Number(usePrankStore().prankInfo?.total) > 0">
      <RecycleScroller
        class="scroller"
        :items="usePrankStore().prankInfo?.list"
        :item-size="item_width"
        :buffer="recycleScrollerBuffer"
        key-field="id"
        v-slot="{ item }"
        page-mode
        @scroll-end="scrollEnd"
      >
        <!-- <div class="question-bank"> -->
        <div class="question-wrap" @click="gotoDetail(item)">
          <div class="user-info-left">
          <div class="user-info">
            <div class="user-avatar">
              <img :src="getThumbnail(item?.open?.avatar)" />
            </div>
            <span class="user-nick">{{ item?.open?.nickname }}</span>
          </div>
          <div class="amount-total" v-if="Number(item?.open?.amount_all) > 0">
            <span class="total">Total</span>
            <span class="total-num">{{ String(commonNumberFormat(Number(item?.open?.amount_all))) }}</span>
          </div>
          </div>
          <div class="question-right">
            <div class="question-center" v-if="isReceivedStatus(item?.open?.status)">
                <img src="@/assets/prank/crit.png" class="center-crit" v-if="Number(item?.open?.ctit_amount) > 0"/>
              <div class="center-position" v-if="Number(item?.open?.ctit_amount) > 0">
                <img src="@/assets/prank/coin-lol.png" class="center-lol" />
                <p class="ctit-text">+{{ String(commonNumberFormat(Number(item?.open?.ctit_amount) + Number(item?.open?.amount))) }}</p>
              </div>
              <div class="question-lol" v-if="Number(item?.open?.ctit_amount) <= 0 && Number(item?.open?.amount) > 0 ">
                <img src="@/assets/prank/coin-lol.png" class="center-lol" />
                <p class="question-amount">+{{ String(commonNumberFormat(Number(item?.open?.amount))) }}</p>
              </div>
            </div>
            <div class="question-btn" v-if="item?.open != null">
              <Button
                v-if="item?.open?.status !== Claim.ReceivedAgain"
                :theme="isReceivedStatus(item?.open?.status)?.theme"
                class="btn"
                :title="isReceivedStatus(item?.open?.status)?.title"
                size="small"
                @click.stop="gotoDetail(item)"
              ></Button>
              <Button
                v-if="item?.open?.status === Claim.ReceivedAgain"
                theme="white"
                class="btn btn-yellow"
                title="Dub"
                size="small"
                @click.stop="exchargePrank(item)"
              ></Button>
              <span class="question-time">{{ showTime(item?.open?.created_at) }}</span>
            </div>
          </div>
        </div>
        <!-- </div> -->
      </RecycleScroller>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EquipStatus, EquipmentModel } from '@/api/model/equipment'
import { Claim, PrankInfo, RefreshEnum } from '@/api/model/question'
import { computed } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import router from '@/router'
import { RecycleScroller } from 'vue-virtual-scroller'
import { useEqptStore } from '@/stores/modules/eqpt'
import { showTime } from '@/utils/timeUtil'
import { usePrankStore } from '@/stores/modules/prank'
import { getThumbnail } from '@/utils/file-helper'
import { commonNumberFormat } from '@/utils/filter/number'

interface Props {
  // Share the Prank method
  sharePrank: () => void
  // Pull-up function
  scrollEnd: (refresh: RefreshEnum) => void
  // Open the answer
  openPrank: (id: string) => void
  // Critical hit rate
  crit: number
  // Method for displaying equipment details
  showDetail: (eqpt: EquipmentModel) => void
  refresh?: RefreshEnum
}

const props = withDefaults(defineProps<Props>(), {})

const userStore = useUserStore()

const windowW = document.documentElement.clientWidth
const clientW = windowW >= 750 ? 750 : windowW
const item_width = 96 * Number(clientW / 375)

// onMounted(() => {
//     props.scrollEnd(RefreshEnum.FirstLoad)
// })

// The height of the buffer preprocessing, in px, does not need to be adjusted here
const recycleScrollerBuffer = ref(document.documentElement.clientHeight * 2) // Preprocessing buffer of twice the current screen height

const userInfo = computed(() => {
  return userStore.userInfo
})

function getTextColor(str) {
  if (Number(str) > 5) {
    return 'whiteColor'
  }
  return 'redColor'
}

function isReceivedStatus(status: Claim) {
  switch(status){
    case Claim.ReceivedAgain:
      return { theme: 'yellow', title: 'Dub' }
    case Claim.Received:
      return { theme: 'purple', title: 'View' }
    default:
        return { theme: 'white', title: 'Dub' }
  }
}

function exchargePrank(item) {
  if (item.open?.status === Claim.ReceivedAgain) {
      // Can be claimed again
      props.openPrank(item.open?.id)
  }
}

function gotoDetail(item) {
      // Rewards have been claimed
      router.push({
        name: 'PrankAnswerDetail',
        query: {
            id: item?.open?.id,
            order: item?.open?.order,
            status: item?.open?.status
        }
      })
}

function scrollEnd() {
  if(props.refresh === RefreshEnum.NoMore) return
    props.scrollEnd(RefreshEnum.FooterRefresh)
    // const prankValue = usePrankStore().prankInfo
    // const len = prankValue.list.length
    // if(prankValue == null || len <= 0) return
    // if (len > 0 && len >= props.limit) {
    // props.scrollEnd(RefreshEnum.FooterRefresh)
    // }
}

</script>

<style lang="less" scoped>
.main {
  padding-top: 3rem;
  padding-left: 2rem;
  padding-right: 2rem;

  .equip-info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .equip-left {
      width: 13.2rem;
      height: 13.2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      &.G1 {
        border: 8px solid transparent;
        border-image: url('@/assets/border/white-1.svg') 8 fill stretch;
      }

      &.G2 {
        border: 8px solid transparent;
        border-image: url('@/assets/border/blue-1.5.svg') 8 fill stretch;
      }

      &.G3 {
        border: 10px solid transparent;
        border-image: url('@/assets/border/purple-1.5.svg') 10 fill stretch;
      }

      &.G4 {
        border: 12px solid transparent;
        border-image: url('@/assets/border/yellow-2.svg') 12 fill stretch;
      }

      &.G5 {
        border: 12px solid transparent;
        border-image: url('@/assets/border/red-2.svg') 12 fill stretch;
      }

      .equip-current {
        width: 3.6rem;
        height: 3.6rem;
        position: absolute;
        right: -1.8rem;
        bottom: -1.8rem;
      }

      .current-url {
        width: 11.8rem;
        height: 11.8rem;
      }
    }

    .equip-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      margin-left: 2.3rem;
      position: relative;

      .equip-info-wrap {
        display: flex;
        justify-content: space-between;
        font-family: PixeloidSans;

        .equip-title {
          font-size: 1.4rem;
          line-height: 2.4rem;
          color: #b5bfc9;
        }

        .equip-content {
          font-size: 1.4rem;
          line-height: 2.4rem;
          color: #ffffff;
        }

        .whiteColor {
          color: #ffffff;
        }

        .redColor {
          color: #ea4335;
        }
      }

      .power {
        margin-top: 0.8rem;
      }

      .line {
        width: 100%;
        height: 0.1rem;
        margin-top: 1.1rem;
        margin-bottom: 0.8rem;
      }
    }
  }

  .prank-btn {
    margin-top: 1.8rem;
  }

  .question-bank {
    margin-top: 2.4rem;

    .scroller {
      display: flex;
      flex-direction: column;

      .question-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        min-height: 8rem;
        font-family: PixeloidSans-Bold;
        font-size: 1.8rem;
        line-height: 2.4rem;
        border: 8px solid transparent;
        border-image: url('@/assets/border/purple-1.svg') 8 fill stretch;
        cursor: pointer;
        padding-left: 1.4rem;
        padding-right: 1.4rem;

        .user-info-left {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-width: 0;

        .user-info {
          display: flex;
          flex-direction: row;
          align-items: center;
          min-width: 0;

          .user-avatar {
            width: 3.6rem;
            height: 3.6rem;
            margin-right: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 8px solid transparent;
            border-image: url('@/assets/border/purple-1.svg') 8 fill stretch;

            img {
              width: 2.4rem;
              height: 2.4rem;
              border-radius: 50%;
            }
          }

          .user-nick {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .amount-total {
            font-size: 1.2rem;
            line-height: 2.4rem;
            font-family: PixeloidSans;
            position: absolute;
            bottom: 0;
            left: 2.2rem;
          .total {
            color: #B5BFC9;
          }
          .total-num {
            margin-left: 0.4rem;
            color: #FFD83E;
          }
        }
        }

        .question-right {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-shrink: 0;

          .question-lol {
            display: flex;
            flex-direction: row;
            align-items: center;
            font-size: 1.4rem;
            line-height: 2rem;
            color: #ffd83e;
            font-family: PixeloidSans;

            .question-amount {
              font-family: PixeloidSans-Bold;
            }

            .center-lol {
                width: 2.1rem;
                height: 2rem;
                margin-right: 0.2rem;
              }
          }

          .question-center {
            position: relative;

            .center-crit {
                width: 4.5rem;
                height: 2.4rem;
                margin-right: 0.2rem;
                position: absolute;
                right: -0.2rem;
                top: -2.3rem;
            }

            .center-position {
              // position: absolute;
              display: flex;
              flex-direction: row;
              z-index: 1;
              align-items: center;

              .center-lol {
                width: 2.1rem;
                height: 2rem;
                margin-right: 0.2rem;
              }

              .ctit-text {
                font-size: 1.4rem;
                line-height: 2.4rem;
                color: #ea4335;
                font-family: PixeloidSans-Bold;
              }
            }
          }

          .question-btn {
            position: relative;

            .btn {
              width: 7.6rem;
              height: 3.6rem;
              margin-left: 0.8rem;
            }

            .question-time {
              font-size: 1.2rem;
              line-height: 2.4rem;
              color: #b5bfc9;
              font-family: PixeloidSans;
              position: absolute;
              text-align: center;
              text-align: center;
              // margin-left: 0.8rem;
              min-width: 9.2rem;
            }
          }
        }
      }
    }
  }
  .btn-yellow.button-container{
              width: 7.6rem;
              height: 3.6rem;
              margin-left: 0.8rem;
    border-image: url('@/assets/bg/btn-yellow-small.svg') 13 fill stretch;
  }
}
</style>
