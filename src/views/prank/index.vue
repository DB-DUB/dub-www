<template>
  <div class="prank-main">
    <div class="prank-main-inner">
      <PrankAnswers
        v-if="usePrankStore().prankType === PrankEnum.Question"
        :share-prank="sharePrank"
        :scrollEnd="getList"
        :openPrank="openQuestion"
        :crit="Number(crit)"
        :showDetail="showDetail"
        :refresh="state"
      />
      <PrankEqpts
        v-else-if="usePrankStore().prankType === PrankEnum.Equip"
        :share-prank="sharePrank"
        :showDetail="showDetail"
        :onChange="onChange"
      />
      <Teleport to="body">
      <DetailModel 
      :visible="modalData?.visible"
      :amount="modalData?.amount"
      :ctit_amount="modalData?.ctit_amount"
      :onClose="onModalClose"
      >
      </DetailModel>
      <Modal
        v-model:show="modalVisible"
        title="Egg needs repair"
      >
        <template #footer>
          <Button
            theme="purple"
            title="Repair egg"
            class="detail-btn"
            @click="seenDetail"
          >
          </Button>
        </template>
      </Modal>
        <!-- <ShareModal v-bind="shareModalInfo" v-model:show="shareModalInfo.show" /> -->
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref, onMounted, onUnmounted, onBeforeMount, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import 'swiper/less'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { useUserStore } from '@/stores/modules/user'
import { getPrankList, openPrank } from '@/api/question'
import PrankAnswers from '@/views/prank/Answers.vue'
import PrankEqpts from '@/views/prank/Eqpts.vue'
import { PrankEnum, RefreshEnum, PrankList, Claim } from '@/api/model/question'
import ToastManager from '@/components/Toast/ToastManager'
import { EquipmentModel } from '@/api/model/equipment'
import { useEqptStore } from '@/stores/modules/eqpt'
import { SubName, pubSubUtil } from '@/utils/pub-sub'
import { useEqptCritical } from '@/utils/eqptUtil'
import { usePrankStore } from '@/stores/modules/prank'
import { ErrorCodeEnum } from '@/api/model/enums'
import { usePageVisibility } from '@/utils/composables/usePageVisibility'
import Modal from '@/components/Modal/index.vue'
import DetailModel from './DetailModel.vue'

const userStore = useUserStore()
const prankStore = usePrankStore()
const route = useRoute()

const state: Ref<RefreshEnum> = ref(RefreshEnum.FirstLoad)
const pos: Ref<number> = ref(0)
const limit: Ref<number> = ref(10)
// loading
const prankLoading: Ref<boolean> = ref(false)
const eqptStore = useEqptStore()
// Critical hit rate
const crit = computed(() => {
  return (Number(useEqptCritical(eqptStore.currentEqpt)) * 100).toFixed(2)
})
const modalVisible = ref(false)

let prankSub

watch(
  () => route.name,
  (newVal, oldVal) => {
    if (newVal === 'PrankMain') {
      pos.value = 0
      usePrankStore().setInfo({ total: 0, total_unclaimed: 0, list: [] })
      getList(RefreshEnum.FirstLoad)
    }
  }
)

onBeforeMount(() => {
  document.addEventListener(visibilityChange, pageChange, false)
})

onMounted(() => {
  getList(RefreshEnum.FirstLoad)

  prankSub = pubSubUtil.on(SubName.OpenPrank, params => {
    const id = params?.id
    const open = params?.open
    if (id) {
      const list = usePrankStore().prankInfo.list
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        if (item?.open?.id === id) {
          item.open.status = Claim.Received
          item.open.amount = open?.amount
          item.open.ctit_amount = open?.ctit_amount
          return
        }
      }
      usePrankStore().setInfo({ ...usePrankStore().prankInfo, list })
    }
  })
})

onUnmounted(() => {
  prankSub && pubSubUtil.off(prankSub)
  prankStore.clearShowEqpt()
  document.removeEventListener(visibilityChange, pageChange, false)
})

const { isPageHidden, visibilityChange } = usePageVisibility()

const modalData = ref<{
  visible: boolean
  title?: string
  amount: string
  ctit_amount: string
}>({ 
  visible: false,
  amount: '0',
  ctit_amount: '0'
})

function pageChange(e) {
  if (isPageHidden() || e.hidden || document.visibilityState === 'hidden') {
  } else {
    usePrankStore().prankInfo = { total: 0, total_unclaimed: 0, list: [] }
    pos.value = 0
    getList(RefreshEnum.FirstLoad)
  }
}

function getList(refresh: RefreshEnum) {
  state.value = refresh

  const defaultList = prankStore.prankInfo?.list?.slice() || []
  const defaultPos = pos.value

  return getPrankList(pos.value, limit.value)
    .then(res => {
      if (Number(res?.total) > 0) {
        prankStore.setType(PrankEnum.Question)
      } else {
        prankStore.setType(PrankEnum.Equip)
      }
      const list = res.list?.slice() || []
      let arr: PrankList[] = []
      if (list.length > 0) {
        const unclaimed = res.total_unclaimed || 0
        prankStore.setClaimed(unclaimed)
        for (let i = 0; i < res.list.length; i++) {
          const item = res.list[i]
          arr.push({ id: item.open?.id, open: item.open })
        }
      }

      if (refresh === RefreshEnum.FooterRefresh) {
        // pull up
        arr = defaultList.concat(arr)
      }
      if (list.length < limit.value) {
        // no data
        state.value = RefreshEnum.NoMore
      } else {
        state.value = RefreshEnum.FooterRefresh
      }
      pos.value = defaultPos + list.length
      prankStore.setInfo({ ...res, list: arr })
      return arr
    })
    .catch(e => {
      prankStore.setType(PrankEnum.Equip)
      throw e
    })
}

if (route.query?.type === 'prank') {
  sharePrank()
}

const showShareModal = inject('showShareModal', () => {})

function sharePrank() {
  if (userStore.userInfo?.id) {
    // Share Prank Pop ups
    showShareModal()
  }
}

function openQuestion(id: string) {
  if (prankLoading.value) return
  prankLoading.value = true
  openPrank(id)
    .then(res => {
      prankLoading.value = false
      if(Number(res?.open?.amount) > 0 || Number(res?.open?.ctit_amount) > 0){
    modalData.value ={
        visible: true,
        amount: res?.open?.amount,
        ctit_amount: res?.open?.ctit_amount
      }
      }
      const defaultList = usePrankStore().prankInfo.list || []
      // modify state
      for (let i = 0; i < defaultList.length; i++) {
        if (defaultList[i].open.id === id) {
          defaultList[i].open.status = Claim.Received
          defaultList[i].open.amount_all = String(
            Number(defaultList[i]?.open?.amount_all) + Number(res?.open?.amount)
          )
          defaultList[i].open.amount = res?.open?.amount
          defaultList[i].open.ctit_amount = res?.open?.ctit_amount
          return
        }
      }
      usePrankStore().setInfo({ ...usePrankStore().prankInfo, list: defaultList })
    })
    .catch(e => {
      prankLoading.value = false
      if (e.code === ErrorCodeEnum.NoStamina) {
        // Without physical strength
        ToastManager().showToast('No stamina', 'warn')
      } else if (e.code === ErrorCodeEnum.NoEggEndurance) {
        // Equipment lacks durability
        modalVisible.value = true
        // ToastManager().showToast('No egg endurance', 'warn')
      }
    })
}

function showDetail(eqpt: EquipmentModel) {
  pubSubUtil.emit(SubName.OpenEquipmentInfo, {
    eqptList: useEqptStore().eqptList,
    defaultEqptId: eqpt?.equip_id
  })
}

function onChange(item: EquipmentModel) {
  if (item && item.id === '-1') return
  if (item && item?.id) {
    prankStore.setShowEqpt(item)
  }
}

const onModalClose = () => {
  modalData.value ={
    visible: false,
    amount: '0',
    ctit_amount: '0'
  }
}

function seenDetail(){
    modalVisible.value = false
    pubSubUtil.emit(SubName.OpenEquipmentInfo, {
    eqptList: useEqptStore().eqptList,
    defaultEqptId: useEqptStore().currentEqpt?.equip_id
  })
  }

</script>

<style lang="less" scoped>
.prank-main {
  .prank-main-inner {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 37.5rem;
    margin: 0 auto;
  }
}
</style>
