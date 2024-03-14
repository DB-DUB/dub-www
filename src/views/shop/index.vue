<template>
  <div class="shop-main">
    <div class="shop-main-inner">
      <div class="shop-title">
        <span class="display-block">Equipment</span>
        <div v-if="useWeb3Const().exchange.tokenAirdrop" class="airdrop-wrap">
          <img class="airdrop-img" src="@/assets/shop/airdrop.png" />
          <div class="airdrop-desp">
            <span class="display-block desp1">Airdrop</span>
            <span class="display-block desp2">Coming soon</span>
          </div>
        </div>
      </div>
      <div class="shop-draw">
        <div class="egg-wrap">
          <img class="egg" src="@/assets/shop/egg.png" />
          <div class="price-wrap">
            <div class="price">
              <span class="display-block">{{ useWeb3Const().drawEqptFixSOL }}</span>
            </div>
            <div class="unit">
              <span class="display-block">SOL</span>
            </div>
          </div>
        </div>

        <div class="detail">
          <div class="title">
            <span class="display-block">Random Egg</span>
          </div>
          <div class="content">
            <span class="display-block">Buy an egg, its quality will be random, good luck!</span>
          </div>
          <div class="buy">
            <div class="btn">
              <Button
                :loading="shopInfo.drawEqptLoading"
                @click="drawEqpt()"
                title="Buyx1"
                size="small"
                class="shop-draw-btn"
              ></Button>
              <Button
                :loading="shopInfo.drawEqpt10Loading"
                @click="drawEqpt10()"
                title="Buyx10"
                size="small"
                class="shop-draw-btn"
              ></Button>
            </div>
          </div>
          <div class="alchemy">
            <img class="alchemy-icon" src="@/assets/shop/alchemy.png" />
            <div class="alchemy-txt-wrap">
              <span class="alchemy-txt-normal">Buy </span>
              <span class="alchemy-txt-special">SOL </span><br />
              <span class="alchemy-txt-normal">with cash</span>
            </div>
            <div class="alchemy-btn-wrap">
              <Button class="alchemy-btn" @click="buySOL()" title="Buy" size="mini"></Button>
            </div>
          </div>
        </div>
      </div>

      <div class="exchange-title">
        <span class="display-block">Exchange</span>
      </div>

      <div class="exchange-lol">
        <div class="left">
          <div class="title">
            <span class="dub">$DUB</span>
            <img class="to" src="@/assets/shop/arrow.png" />
            <img class="lol-img" src="@/assets/prank/coin-lol.png" />
          </div>
          <div class="exchange">
            <img
              v-if="shopInfo.dub2LolAmt <= useWeb3Const().exchange.DUB2LOL.min"
              class="exchange-img"
              src="@/assets/shop/minus-disable.png"
            />
            <img
              v-if="shopInfo.dub2LolAmt > useWeb3Const().exchange.DUB2LOL.min"
              class="exchange-img"
              src="@/assets/shop/minus.png"
              @touchstart.stop="e => longClickStart(e, 'dub2lol|minus')"
              @touchend.stop="e => longClickEnd(e, 'dub2lol|minus')"
              @touchcancel.stop="e => longClickEnd(e, 'dub2lol|minus')"
              @mousedown.stop="e => longClickStart(e, 'dub2lol|minus')"
              @mouseup.stop="e => longClickEnd(e, 'dub2lol|minus')"
              @mouseout.stop="e => longClickEnd(e, 'dub2lol|minus')"
            />
            <div
              class="exchange-wrap"
              :class="[
                `L${
                  shopInfo.dub2LolAmt.toString().length +
                  useWeb3Const().exchange.DUB2LOL.unitStr.length
                }`
              ]"
            >
              <input
                id="exchange-input-lol"
                maxlength="6"
                type="text"
                class="exchange-input exchange-input-lol"
                :class="[
                  `L${
                    shopInfo.dub2LolAmt.toString().length +
                    useWeb3Const().exchange.DUB2LOL.unitStr.length
                  }`
                ]"
                :value="shopInfo.dub2LolAmt"
                @input="e => checkInputExchangeLOLAmt(e)"
                @change="e => changeInputExchangeLOLAmt(e)"
              />
              <span @click="focusExchangeInputLOL()" class="exchange-txt">{{
                useWeb3Const().exchange.DUB2LOL.unitStr
              }}</span>
            </div>
            <img
              v-if="shopInfo.dub2LolAmt < useWeb3Const().exchange.DUB2LOL.max"
              class="exchange-img"
              src="@/assets/shop/add.png"
              @touchstart.stop="e => longClickStart(e, 'dub2lol|add')"
              @touchend.stop="e => longClickEnd(e, 'dub2lol|add')"
              @touchcancel.stop="e => longClickEnd(e, 'dub2lol|add')"
              @mousedown.stop="e => longClickStart(e, 'dub2lol|add')"
              @mouseup.stop="e => longClickEnd(e, 'dub2lol|add')"
              @mouseout.stop="e => longClickEnd(e, 'dub2lol|add')"
            />
            <img
              v-if="shopInfo.dub2LolAmt >= useWeb3Const().exchange.DUB2LOL.max"
              class="exchange-img"
              src="@/assets/shop/add-disable.png"
            />
          </div>
          <div class="result">
            <span class="display-block">
              {{
                shopInfo.dub2LolAmt *
                useWeb3Const().exchange.DUB2LOL.unit *
                useWeb3Const().exchange.rate
              }}</span
            >
            <img class="lol-result-img" src="@/assets/prank/coin-lol.png" />
          </div>
          <div v-if="useUserStore().estimateGas != null" class="gas">
            <span class="display-block">Gas ≈ {{ useUserStore().estimateGas }} SOL</span>
          </div>
        </div>
        <div class="right">
          <div v-if="useWeb3Const().exchange.tokenRelease" class="btn">
            <Button
              :loading="shopInfo.exchangeLOLLoading"
              @click="exchangeLOL()"
              title="Buy"
              size="small"
            ></Button>
          </div>
          <div v-if="!useWeb3Const().exchange.tokenRelease" class="btn">
            <Button
              :loading="shopInfo.exchangeLOLLoading"
              title="Coming soon"
              size="small"
              class="coming_soon_btn"
              :disabled="!useWeb3Const().exchange.tokenRelease"
            ></Button>
          </div>
          <div v-if="!isEmpty(useUserStore().userInfo?.dub)" class="balance">
            <span class="desp">Balance: </span>
            <span class="amt">{{
              commonShortNumberFormat(Number(useUserStore().userInfo?.dub))
            }}</span>
            <span class="unit"> $DUB</span>
          </div>
        </div>
      </div>
      <div class="exchange-dub">
        <div class="left">
          <div class="title">
            <img class="lol-img" src="@/assets/prank/coin-lol.png" />
            <img class="to" src="@/assets/shop/arrow.png" />
            <span class="dub">$DUB</span>
          </div>
          <div class="exchange">
            <img
              v-if="shopInfo.lol2DubAmt <= useWeb3Const().exchange.LOL2DUB.min"
              class="exchange-img"
              src="@/assets/shop/minus-disable.png"
            />
            <img
              v-if="shopInfo.lol2DubAmt > useWeb3Const().exchange.LOL2DUB.min"
              class="exchange-img"
              src="@/assets/shop/minus.png"
              @touchstart.stop="e => longClickStart(e, 'lol2dub|minus')"
              @touchend.stop="e => longClickEnd(e, 'lol2dub|minus')"
              @touchcancel.stop="e => longClickEnd(e, 'lol2dub|minus')"
              @mousedown.stop="e => longClickStart(e, 'lol2dub|minus')"
              @mouseup.stop="e => longClickEnd(e, 'lol2dub|minus')"
              @mouseout.stop="e => longClickEnd(e, 'lol2dub|minus')"
            />
            <div
              class="exchange-wrap"
              :class="[
                `L${
                  shopInfo.lol2DubAmt.toString().length +
                  useWeb3Const().exchange.LOL2DUB.unitStr.length
                }`
              ]"
            >
              <input
                id="exchange-input-dub"
                maxlength="6"
                type="text"
                class="exchange-input exchange-input-dub"
                :class="[
                  `L${
                    shopInfo.lol2DubAmt.toString().length +
                    useWeb3Const().exchange.LOL2DUB.unitStr.length
                  }`
                ]"
                :value="shopInfo.lol2DubAmt"
                @input="e => checkInputExchangeDUBAmt(e)"
                @change="e => changeInputExchangeDUBAmt(e)"
              />
              <span @click="focusExchangeInputDub()" class="exchange-txt">{{
                useWeb3Const().exchange.LOL2DUB.unitStr
              }}</span>
            </div>
            <img
              v-if="shopInfo.lol2DubAmt < useWeb3Const().exchange.LOL2DUB.max"
              class="exchange-img"
              src="@/assets/shop/add.png"
              @touchstart.stop="e => longClickStart(e, 'lol2dub|add')"
              @touchend.stop="e => longClickEnd(e, 'lol2dub|add')"
              @touchcancel.stop="e => longClickEnd(e, 'lol2dub|add')"
              @mousedown.stop="e => longClickStart(e, 'lol2dub|add')"
              @mouseup.stop="e => longClickEnd(e, 'lol2dub|add')"
              @mouseout.stop="e => longClickEnd(e, 'lol2dub|add')"
            />
            <img
              v-if="shopInfo.lol2DubAmt >= useWeb3Const().exchange.LOL2DUB.max"
              class="exchange-img"
              src="@/assets/shop/add-disable.png"
            />
          </div>
          <div class="result">
            <span class="display-block"
              >$DUB
              {{
                (shopInfo.lol2DubAmt * useWeb3Const().exchange.LOL2DUB.unit) /
                useWeb3Const().exchange.rate
              }}</span
            >
          </div>
          <div v-if="useUserStore().estimateGas != null" class="gas">
            <span class="display-block">Gas ≈ {{ useUserStore().estimateGas }} SOL</span>
          </div>
        </div>
        <div class="right">
          <div v-if="useWeb3Const().exchange.tokenRelease" class="btn">
            <Button
              :loading="shopInfo.exchangeDUBLoading"
              @click="exchangeDUB()"
              title="Buy"
              size="small"
            ></Button>
          </div>
          <div v-if="!useWeb3Const().exchange.tokenRelease" class="btn">
            <Button
              :loading="shopInfo.exchangeDUBLoading"
              title="Coming soon"
              size="small"
              class="coming_soon_btn"
              :disabled="!useWeb3Const().exchange.tokenRelease"
            ></Button>
          </div>
        </div>
      </div>
      <div
        v-if="useWeb3Const().exchange.tokenRelease"
        class="exchange-jupiter"
        @click="openJupiter()"
      >
        <img class="jupiter-logo" src="@/assets/shop/jupiter-logo.png" />
        <span class="normal">Buy</span>
        &nbsp;&nbsp;
        <span class="dub">$DUB </span>
        &nbsp;&nbsp;
        <span class="normal">in </span>
        &nbsp;&nbsp;
        <span class="jupiter">Jupiter</span>
      </div>
      <Teleport to="body">
        <Modal
          v-model:show="modalInfo.visible"
          title="You’ve got an egg!"
          :wrapper-class="['draw-eqpt-wrap']"
        >
          <template #footer>
            <div class="common-modal-footer-inner draw1">
              <div class="draw-eqpt-img-wrap" :class="[`G${modalInfo.eqpt?.grade}`]">
                <img class="draw-eqpt-img" v-bind:src="getThumbnail(modalInfo.eqpt?.url || '')" />
              </div>
              <span class="draw-eqpt-txt" :class="[`G${modalInfo.eqpt?.grade}`]">{{
                useEqptName(modalInfo.eqpt?.grade)
              }}</span>
            </div>
          </template>
        </Modal>
        <Modal
          v-model:show="modalInfo10.visible"
          title="You’ve got 10 eggs!"
          :wrapper-class="['draw-eqpt-wrap']"
        >
          <template #footer>
            <div class="common-modal-footer-inner draw10">
              <div class="draw10-item" v-for="eqpt in modalInfo10.eqptList" :key="eqpt.equip_id">
                <div class="draw-eqpt-img-wrap" :class="[`G${eqpt?.grade}`]">
                  <img class="draw-eqpt-img" v-bind:src="getThumbnail(eqpt?.url || '')" />
                </div>
                <span class="draw-eqpt-txt" :class="[`G${eqpt.grade}`]">{{
                  useEqptNameV2(eqpt?.grade)
                }}</span>
              </div>
            </div>
          </template>
        </Modal>
        <AlchemyPay
          v-if="alchemyPayModal.visible"
          :address="alchemyPayModal.address"
          @close="closeAlchemyPay()"
        />
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EquipmentModel } from '@/api/model/equipment'
import { handleWeb3Error, useWeb3Const } from '@/utils/web3/base'
import { reactive, ref } from 'vue'
import { useEqptName, useEqptNameV2 } from '@/utils/eqptUtil'
import { useUserStore } from '@/stores/modules/user'
import { processExchangeLOL, processExchangeDUB } from '@/api/web3'
import isEmpty from 'lodash-es/isEmpty'
import { commonShortNumberFormat } from '@/utils/filter/number'
import ToastManager from '@/components/Toast/ToastManager'
import { useEqptStore } from '@/stores/modules/eqpt'
import { SubName, pubSubUtil } from '@/utils/pub-sub'
import { getThumbnail } from '@/utils/file-helper'
interface ModalInfo {
  eqpt?: EquipmentModel
  visible: boolean
}
interface ModalInfo10 {
  eqptList: EquipmentModel[]
  visible: boolean
}
interface ShopInfo {
  dub2LolAmt: number
  lol2DubAmt: number
  drawEqptLoading: boolean
  drawEqpt10Loading: boolean
  exchangeLOLLoading: boolean
  exchangeDUBLoading: boolean
}
interface AlchemyPayInfo {
  address?: string
  visible: boolean
}
const modalInfo = reactive<ModalInfo>({
  eqpt: undefined,
  visible: false
})
const modalInfo10 = reactive<ModalInfo10>({
  eqptList: [],
  visible: false
})
const shopInfo = reactive<ShopInfo>({
  dub2LolAmt: useWeb3Const().exchange.DUB2LOL.min,
  lol2DubAmt: useWeb3Const().exchange.LOL2DUB.min,
  drawEqptLoading: false,
  drawEqpt10Loading: false,
  exchangeLOLLoading: false,
  exchangeDUBLoading: false
})
const alchemyPayModal = reactive<AlchemyPayInfo>({
  visible: false
})
function drawEqpt() {
  if (shopInfo.drawEqptLoading) {
    return
  }
  shopInfo.drawEqptLoading = true
  useEqptStore()
    .draw()
    .then(eqpt => {
      modalInfo.eqpt = eqpt
      modalInfo.visible = true
      shopInfo.drawEqptLoading = false
    })
    .catch(e => {
      shopInfo.drawEqptLoading = false
      handleWeb3Error(e)
    })
}
function drawEqpt10() {
  if (shopInfo.drawEqpt10Loading) {
    return
  }
  shopInfo.drawEqpt10Loading = true
  useEqptStore()
    .draw10()
    .then(eqptList => {
      modalInfo10.eqptList = eqptList
      modalInfo10.visible = true
      shopInfo.drawEqpt10Loading = false
    })
    .catch(e => {
      shopInfo.drawEqpt10Loading = false
      handleWeb3Error(e)
    })
}
function buySOL() {
  const address = useUserStore().userInfo?.address
  if (isEmpty(address)) {
    pubSubUtil.emit(SubName.BindWallet)
    return
  }
  alchemyPayModal.address = address
  alchemyPayModal.visible = true
}
function closeAlchemyPay() {
  alchemyPayModal.visible = false
}
function exchangeLOL() {
  if (shopInfo.exchangeLOLLoading) {
    return
  }
  shopInfo.exchangeLOLLoading = true
  const dub = shopInfo.dub2LolAmt * useWeb3Const().exchange.DUB2LOL.unit
  processExchangeLOL(dub)
    .then(resp => {
      shopInfo.exchangeLOLLoading = false
      useUserStore().updateUserInfo(resp.user)
      ToastManager().showToast('Exchange successfully', 'success')
    })
    .catch(e => {
      shopInfo.exchangeLOLLoading = false
      handleWeb3Error(e)
    })
}
function exchangeDUB() {
  if (shopInfo.exchangeDUBLoading) {
    return
  }
  shopInfo.exchangeDUBLoading = true
  const lol = shopInfo.lol2DubAmt * useWeb3Const().exchange.LOL2DUB.unit
  processExchangeDUB(lol)
    .then(resp => {
      shopInfo.exchangeDUBLoading = false
      resp?.user && useUserStore().updateUserInfo(resp.user)
      ToastManager().showToast('Exchange successfully', 'success')
    })
    .catch(e => {
      shopInfo.exchangeDUBLoading = false
      handleWeb3Error(e)
    })
}

function openJupiter() {
  window.open(useWeb3Const().exchange.jupiterUrl, '_blank')
}

const isSupportTouch = 'ontouchstart' in document.documentElement || 'ontouchstart' in window
const longClickType = ref('')
function longPressFun(type) {
  requestAnimationFrame(() => {
    switch (type) {
      case 'dub2lol|add':
        addExchangeLOLAmt()
        break
      case 'dub2lol|minus':
        minusExchangeLOLAmt()
        break
      case 'lol2dub|add':
        addExchangeDUBAmt()
        break
      case 'lol2dub|minus':
        minusExchangeDUBAmt()
        break
    }

    setTimeout(() => {
      if (longClickType.value) {
        longPressFun(type)
      }
    }, 100)
  })
}
function longClickStart(e, type) {
  e.preventDefault()
  //Support touch events, mouse events are invalid
  if (isSupportTouch && (!e.targetTouches || e.targetTouches.length === 0)) {
    return false
  }
  longClickType.value = type
  setTimeout(() => {
    if (longClickType.value) {
      longPressFun(type)
    }
  }, 500)
}
function longClickEnd(e, type) {
  e.preventDefault()
  if (longClickType.value !== type) {
    return false
  }
  longClickType.value = ''
  switch (type) {
    case 'dub2lol|add':
      addExchangeLOLAmt()
      break
    case 'dub2lol|minus':
      minusExchangeLOLAmt()
      break
    case 'lol2dub|add':
      addExchangeDUBAmt()
      break
    case 'lol2dub|minus':
      minusExchangeDUBAmt()
      break
  }
}

function addExchangeLOLAmt() {
  shopInfo.dub2LolAmt += 1
}
function minusExchangeLOLAmt() {
  shopInfo.dub2LolAmt = Math.max(shopInfo.dub2LolAmt - 1, useWeb3Const().exchange.DUB2LOL.min)
}
function addExchangeDUBAmt() {
  shopInfo.lol2DubAmt += 1
}
function minusExchangeDUBAmt() {
  shopInfo.lol2DubAmt = Math.max(shopInfo.lol2DubAmt - 1, useWeb3Const().exchange.LOL2DUB.min)
}

function checkInputExchangeLOLAmt(e) {
  e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
  const nextVal = Number(e.target.value)
  if (isNaN(nextVal)) {
    shopInfo.dub2LolAmt = shopInfo.dub2LolAmt
    return
  }
  if (nextVal < useWeb3Const().exchange.DUB2LOL.min) {
    shopInfo.dub2LolAmt = useWeb3Const().exchange.DUB2LOL.min
    return
  }
  if (nextVal > useWeb3Const().exchange.DUB2LOL.max) {
    shopInfo.dub2LolAmt = useWeb3Const().exchange.DUB2LOL.max
    return
  }
  shopInfo.dub2LolAmt = nextVal
}

function changeInputExchangeLOLAmt(e) {
  e.target.value = shopInfo.dub2LolAmt
}
function focusExchangeInputLOL() {
  document.getElementById('exchange-input-lol')?.focus()
}

function checkInputExchangeDUBAmt(e) {
  e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
  const nextVal = Number(e.target.value)
  if (isNaN(nextVal)) {
    return
  }
  if (nextVal < useWeb3Const().exchange.LOL2DUB.min) {
    shopInfo.lol2DubAmt = useWeb3Const().exchange.LOL2DUB.min
    return
  }
  if (nextVal > useWeb3Const().exchange.LOL2DUB.max) {
    shopInfo.lol2DubAmt = useWeb3Const().exchange.LOL2DUB.max
    return
  }
  shopInfo.lol2DubAmt = nextVal
}

function changeInputExchangeDUBAmt(e) {
  e.target.value = shopInfo.lol2DubAmt
}
function focusExchangeInputDub() {
  document.getElementById('exchange-input-dub')?.focus()
}
</script>

<style lang="less" scoped>
.shop-main {
  .shop-main-inner {
    padding-top: 2.7rem;
    width: 37.5rem;
    margin: 0 auto;
  }
}
.display-block {
  display: block;
}
.shop-title {
  font-family: PixeloidSans;
  font-size: 1.8rem;
  line-height: 3.6rem;
  color: #ffffff;
  margin-left: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .airdrop-wrap {
    display: flex;
    flex-direction: row;
    margin-right: 3rem;
    .airdrop-img {
      width: 2.8rem;
      height: 2.8rem;
      margin-right: 0.8rem;
    }
    .airdrop-desp {
      display: flex;
      flex-direction: column;
      font-size: 1.2rem;
      line-height: 1.5rem;
      .desp1 {
        font-family: PixeloidSans-Bold;
        color: #ffd83e;
      }
      .desp2 {
        font-family: PixeloidSans;
        color: #869aa9;
      }
    }
  }
}
.shop-draw {
  margin-top: 1.2rem;
  margin-left: 3rem;
  margin-right: 3rem;
  display: flex;
  flex-direction: row;
  position: relative;
  .egg-wrap {
    width: 13.2rem;
    height: 13.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1.2rem;
    border: 8px solid transparent;
    border-image: url('@/assets/border/grey-double.svg') 8 fill stretch;
    .egg {
      width: 5.6rem;
      height: 7.2rem;
    }
    .price-wrap {
      display: flex;
      flex-direction: row;
      margin-top: 0.7rem;
      .price {
        font-family: PixeloidSans-Bold;
        font-size: 1.8rem;
        line-height: 1.96rem;
        color: #ffd83e;
      }
      .unit {
        margin-left: 0.2rem;
        font-family: PixeloidSans;
        font-size: 1.4rem;
        line-height: 1.96rem;
        color: #ffffff;
      }
    }
  }
  .detail {
    flex-direction: row;
    margin-top: 0.2rem;
    margin-left: 1.2rem;
    .title {
      font-family: PixeloidSans-Bold;
      font-size: 1.4rem;
      line-height: 2.4rem;
      color: #ffffff;
    }
    .content {
      width: 16.4rem;
      font-family: PixeloidSans;
      font-size: 1.2rem;
      line-height: 1.5rem;
      margin-top: 0.5rem;
      color: #b5bfc9;
    }
    .buy {
      display: flex;
      align-items: center;
      margin-top: 1rem;
      height: 3.6rem;
      flex-direction: row;
      .btn {
        display: flex;
        flex-direction: row;
        .shop-draw-btn.button-container {
          width: 8.2rem;
          margin-right: 0.8rem;
        }
      }
    }
    .alchemy {
      position: relative;
      margin-top: 1rem;
      width: 17.1rem;
      height: 4rem;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 0.4rem;
      padding-right: 0.2rem;
      border: 8px solid transparent;
      border-image: url('@/assets/border/grey-1.5.svg') 8 fill stretch;
      .alchemy-icon {
        width: 2rem;
        height: 1.568rem;
        margin-right: 1rem;
      }
      .alchemy-txt-wrap {
        height: 2.6rem;
        font-family: PixeloidSans;
        font-size: 1.2rem;
        line-height: 1.3rem;
        .alchemy-txt-normal {
          color: #869aa9;
        }
        .alchemy-txt-special {
          color: #1fdfb0;
        }
      }
      .alchemy-btn-wrap {
        right: 0;
        position: absolute;
        .button-container.alchemy-btn {
          width: 4.1rem;
          height: 1.9rem;
        }
      }
    }
  }
}
.exchange-title {
  margin-top: 1rem;
  margin-left: 3rem;
  font-family: PixeloidSans;
  font-size: 1.8rem;
  line-height: 3.6rem;
  color: #ffffff;
}
.exchange-lol,
.exchange-dub,
.exchange-jupiter {
  margin-left: 3rem;
  margin-right: 3rem;
  border: 8px solid transparent;
  border-image: url('@/assets/border/grey-1.5.svg') 8 fill stretch;
}
.exchange-lol,
.exchange-dub {
  display: flex;
  flex-direction: row;
  height: 13.2rem;
  width: 31.5rem;
  .title {
    display: flex;
    align-items: center;
  }
  .dub,
  .lol {
    font-family: PixeloidSans-Bold;
    font-size: 1.8rem;
    line-height: 2.1rem;
  }
  .lol-img {
    width: 2.1rem;
    height: 2rem;
  }
  .lol-result-img {
    margin-right: 0.6rem;
    width: 2.1 * (1.2/2) rem;
    height: 1.2rem;
  }
  .to {
    width: 1.4rem;
    height: 1.4rem;
    margin-left: 0.4rem;
    margin-right: 0.4rem;
  }
  .dub {
    color: #b5bfc9;
  }
  .lol {
    color: #ffd83e;
  }
  .left {
    padding-left: 1.2rem;
    padding-top: 1rem;
    justify-content: center;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-top: 4.8rem;
    padding-right: 1.3rem;
  }
}
.exchange-lol {
  margin-top: 0.4rem;
  .result {
    color: #ffd83e;
  }
}
.exchange-dub {
  margin-top: 1.2rem;
  .result {
    color: #b5bfc9;
  }
}
.exchange-jupiter {
  margin-top: 2.3rem;
  width: 31.5rem;
  height: 5.5rem;
  display: flex;
  align-items: center;
  padding-left: 1.2rem;
  .jupiter-logo {
    width: 3.1rem;
    height: 3.2rem;
    margin-right: 2.7rem;
  }
  .normal,
  .dub,
  .jupiter {
    font-family: PixeloidSans-Bold;
    font-size: 1.8rem;
    line-height: 1.96rem;
  }
  .normal {
    color: #ffffff;
  }
  .dub {
    color: #b5bfc9;
  }
  .jupiter {
    color: #4cd2c7;
  }
}
.exchange {
  display: flex;
  margin-top: 2.3rem;
  height: 2.4rem;
  align-items: center;
  .exchange-img {
    width: 2rem;
    height: 2rem;
  }
  .exchange-wrap,
  .exchange-input {
    font-family: PixeloidSans-Bold;
    color: #ffffff;
    line-height: 2.4rem;
    &.L1,
    &.L2,
    &.L3,
    &.L4 {
      font-size: 1.8rem;
    }
    &.L5 {
      font-size: 1.8rem;
    }
    &.L6 {
      font-size: 1.6rem;
    }
    &.L7 {
      font-size: 1.3rem;
    }
    &.L8 {
      font-size: 1.2rem;
    }
  }
  .exchange-wrap {
    width: 9.8rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .exchange-input {
      text-align: right;
      background-color: transparent;
      border: none;
    }
    .exchange-input-dub {
      &.L1,
      &.L2,
      &.L3,
      &.L4 {
        width: 4.4rem;
      }
      &.L5 {
        width: 5.6rem;
      }
      &.L6 {
        width: 6.4rem;
      }
      &.L7 {
        width: 6.4rem;
      }
    }
    .exchange-input-lol {
      &.L1,
      &.L2,
      &.L3 {
        width: 2rem;
      }
      &.L4 {
        width: 3rem;
      }
      &.L5 {
        width: 4.4rem;
      }
      &.L6 {
        width: 5rem;
      }
      &.L7 {
        width: 5rem;
      }
      &.L8 {
        width: 6.4rem;
      }
    }
    .exchange-input:focus {
      outline: 0 none;
    }
  }
}
.result {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 13.8rem;
  font-family: PixeloidSans;
  font-size: 1.2rem;
  line-height: 2.2rem;
  margin-top: -0.3rem;
}
.gas {
  display: flex;
  justify-content: center;
  width: 13.8rem;
  font-family: PixeloidSans;
  font-size: 1rem;
  line-height: 2rem;
  color: #666666;
  margin-top: -0.6rem;
}
.balance {
  margin-top: 1rem;
  font-family: PixeloidSans;
  overflow: hidden;
  .desp,
  .unit {
    font-size: 1rem;
    line-height: 2rem;
    color: #ffffff;
  }
  .amt {
    font-size: 1.2rem;
    line-height: 2rem;
    color: #b5bfc9;
  }
}
.common-modal-wrap.draw-eqpt-wrap {
  .common-modal-container {
    .draw1 {
      margin-top: 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .draw-eqpt-img-wrap {
        width: 13.2rem;
        height: 13.2rem;
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
        .draw-eqpt-img {
          width: 11.8rem;
          height: 11.8rem;
        }
      }
      .draw-eqpt-txt {
        margin-top: 1rem;
        font-family: PixeloidSans-Bold;
        font-size: 1.4rem;
        line-height: 2.4rem;
        margin-bottom: 2.4rem;
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
    }
    .draw10 {
      margin-top: 2.5rem;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      margin-left: -0.6rem;
      width: 30rem;
      justify-content: space-between;
      .draw10-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 1.2rem;
        .draw-eqpt-img-wrap {
          width: 5.8rem;
          height: 5.8rem;
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
          .draw-eqpt-img {
            width: 4.6rem;
            height: 4.6rem;
          }
        }
        .draw-eqpt-txt {
          margin-top: 0.3rem;
          font-family: PixeloidSans-Bold;
          font-size: 0.75rem;
          line-height: 1.5rem;
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
      }
    }
  }
}
.coming_soon_btn.button-container {
  width: 12.5rem;
  :deep(.title) {
    font-family: PixeloidSans;
    font-size: 1.1rem;
  }
}
</style>
