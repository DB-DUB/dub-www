<template>
    <transition name="fade">
      <div v-if="visible" class="detail-info-container">
        <div class="blur-bg"></div>
        <div class="detail-info-wrap">
          <div class="detail-info-border"></div>
          <div class="detail-info-content">
            <img class="coin-lol" src="@/assets/prank/coin-lol.png" />
            <div class="close-wrap" @click="onClose()">
              <img class="close-icon" src="@/assets/close-icon.svg" alt="" />
            </div>
            <div class="lol-content">
                <span>You looted</span>&nbsp;
                <span class="amount" v-if="Number(ctit_amount) <= 0 && Number(returnNum()) > 0">{{ returnNum() }}</span>
                <div class="crit-wrap" v-if="Number(ctit_amount) > 0">
                <span class="ctitAmount">{{ returnNum() }}</span>
                <img src="@/assets/prank/crit.png" class="crit"/>
                </div>
                &nbsp;<span>gold</span>
            </div>
            <div class="detail-wrap">
            </div>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script setup lang="ts">
import { commonNumberFormat } from '@/utils/filter/number';



  interface Props {
    visible: boolean
    title?: string
    amount: string
    ctit_amount:string
    onClose: () => void
  }
  
  const props = withDefaults(defineProps<Props>(), {
        visible: false,
      title: 'You scored a dub on Jason！',
      amount: '0',
      ctit_amount: '0'
  })

  function returnNum(){
    if(Number(props.ctit_amount) > 0){
        return String(commonNumberFormat(Number(props.ctit_amount) + Number(props.amount)))
    } else {
        return String(commonNumberFormat(Number(props.amount)))
    }
  }

  </script>
  
  <style lang="less" scoped>
  @import '@/styles/constant';
  .detail-info-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    align-items: center;
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
    .detail-info-wrap {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .detail-info-border {
      z-index: 1;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      border: 8px solid transparent;
      transition: all 0.2s;
      border-image: url('@/assets/border/purple-2.svg') 8 fill stretch;
    }
    .detail-info-content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      width: 33.5rem;
      padding: 5rem 1.5rem;

      .coin-lol {
        width: 8.4rem;
        height: 8.4rem;
        position: absolute;
        top: -5.1rem;
        left: 12.6rem;
      }

      .lol-content {
        display: flex;
        flex-direction: row;
        font-size: 2.2rem;
        line-height: 3.2rem;
        color: #fff;
        font-family: PixeloidSans-Bold;
      }

      .amount {
        color: #FFD83E;
      }

      .crit-wrap {
        position: relative;
      .ctitAmount {
        color: #EA4335;
      }

      .crit {
        width: 4.5rem;
        height: 1.9rem;
        position: absolute;
        right: 0;
        top: -2rem;
      }
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
      .detail-wrap {
        display: flex;
        margin-bottom: 1.1rem;
        flex-direction: column;
        align-items: center;

        .detail-top-wrap {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;

          .detail-img-wrap {
            width: 13.2rem;
            height: 13.2rem;
            transition: all 0.2s;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
    }
  }
  </style>