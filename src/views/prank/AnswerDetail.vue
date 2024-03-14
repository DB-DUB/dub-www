<template>
  <div class="prank-answer-detail-all">
    <div class="prank-answer-detail" v-if="questionInfo != null">
      <div class="header">
        <div class="button-container" @click="goBack()">
          <div class="button-content">
            <img src="@/assets/prank/back.png" class="back" />
          </div>
        </div>
        <div class="header-right">
            <img src="@/assets/prank/crit.png" class="crit" v-if="Number(questionInfo?.open?.ctit_amount) > 0"/>
          <div class="right" v-if="Number(questionInfo?.open?.ctit_amount) > 0">
                <img src="@/assets/prank/coin-lol.png" class="center-lol" />
            <p class="ctit-text">+{{ returnNum }}</p>
          </div>
          <div class="right-bottom" v-if="Number(questionInfo?.open?.ctit_amount) <= 0 && Number(returnNum) > 0">
                <img src="@/assets/prank/coin-lol.png" class="center-lol" />
            <p class="amount">+{{ returnNum }}</p>
          </div>
        </div>
      </div>
      <div class="nick-wrap">
        <p class="nick">{{ questionInfo?.answer?.nickname }}</p>
        <p class="time">{{ showTime(questionInfo?.open?.created_at) }}</p>
      </div>
      <ul class="prank-answer-content" :class="{ 'content-dir-rtl': pageDirRtl }">
        <li v-for="(group, groupIndex) in showList" :key="groupIndex" class="prank-answer-item">
          <p class="question">{{ groupIndex + 1 }}.{{ group.question }}</p>
          <p
            class="answer"
            v-show="showAnswer(groupIndex)"
          >
            {{ group.answer }}
          </p>
          <div
            class="answer-mask"
            v-show="showAnswerMask(groupIndex)"
            :class="[`M${groupIndex % 3}`]"
          ></div>
        </li>
      </ul>
    </div>
    <div class="bottom-btn-wrap" v-if="Number(status) === Claim.Unclaimed">
      <Button
        theme="white"
        title="Dub"
        class="bottom-button"
        @click="openQuestion(route.query?.id)"
        :loading="prankLoading"
      ></Button>
    </div>
    <div class="bottom-btn-wrap" v-if="Number(status) === Claim.ReceivedAgain">
      <Button
        theme="white"
        title="Dub"
        class="bottom-button-yellow"
        @click="openQuestion(route.query?.id)"
        :loading="prankLoading"
      ></Button>
    </div>
    <Teleport to="body">
      <DetailModel 
      :title="modalData?.title"
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
      <Loading v-if="loading">
        loading
      </Loading>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getQuestionConfig } from '@/api/question'
import { Claim, PrankQuestion, Answer } from '@/api/model/question'
import { getTopicView, openPrank } from '@/api/question'
import ToastManager from '@/components/Toast/ToastManager'
import { pubSubUtil, SubName } from '@/utils/pub-sub'
import { usePrankStore } from '@/stores/modules/prank'
import { showTime } from '@/utils/timeUtil'
import { useUserStore } from '@/stores/modules/user'
import { ErrorCodeEnum } from '@/api/model/enums'
import { useEqptStore } from '@/stores/modules/eqpt'
import DetailModel from './DetailModel.vue'
import { commonNumberFormat } from '@/utils/filter/number'
import Modal from '@/components/Modal/index.vue'

const prankStore = usePrankStore()
const route = useRoute()
const router = useRouter()

const showList: Ref<Array<{ question: string; answer: string }>> = ref([])
const questionInfo: Ref<PrankQuestion | null> = ref(null)
// loading
const prankLoading: Ref<boolean> = ref(false)
// loading
const loading: Ref<boolean> = ref(false)

const userLang1 = navigator.language
const userLang2 = navigator.language.split('-')[0]
const pageDirRtl = ref(false)

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

onMounted(() => {
  getQuestionDetail()
})

watch(
  () => route.query?.id,
  (newVal, oldVal) => {
    if (newVal !== oldVal && newVal != null) {
        questionInfo.value =null
        showList.value = []
        loading.value = false
        getQuestionDetail()
    }
  }
)

console.log('route.query',route.query)
const status: Ref<Claim> = ref(Claim.None)
const modalVisible = ref(false)

// Get the details of the currently displayed question
function getQuestionDetail() {
  loading.value = true
  Promise.all([getTopicView(route.query?.id),getQuestionConfig(route.query?.order)])
  .then(res=> {
  status.value = route.query?.status
    loading.value =false
    const response = res[0]
    const response2 = res[1]
    questionInfo.value = response
    const answers = response?.answer?.answers
    const langs = Object.keys(response2)
    const selectedLang = langs.includes(userLang1)
        ? userLang1
        : langs.includes(userLang2)
        ? userLang2
        : 'en'
    pageDirRtl.value = selectedLang === 'ar'
    const questions = response2[selectedLang]
    if(answers != null){
      showList.value = questions.map((group, groupIndex) => {
        let answer = ''
        if (['input', 'input-range'].includes(group.type)) {
          answer = answers[groupIndex] || ''
        } else if (group.type === 'checkbox') {
          const answerArray = answers[groupIndex].split(',')
          answer = answerArray
            .map(item => {
              return group.answers[item] || ''
            })
            .join(', ')
        } else if (group.type === 'range') {
          const answerArray: number[] = []
          for (let ii = group.min; ii <= group.max; ii++) {
            answerArray.push(ii)
          }
          answer = answerArray[answers[groupIndex]]
        } else {
            answer = group.answers[answers[groupIndex]] || ''
        }
        return {
          question: group.question || '',
          answer
        }
      })
    }
  }).catch(e => {
    loading.value = false
  })
  // getTopicView(route.query?.open?.id).then(res => {
  //   questionInfo.value = res
  //   time.value = res?.open?.created_at
  //   getQuestionInfo(res.answer)
  // })
}

function showAnswer(index: number) {
  if(showList.value){
    const length = showList.value.length
    if(length > 0 && length > 3){
      return (index < length - 3 || Number(status.value) === Claim.Received)
    } else {
      return true
    }
  }
}

function showAnswerMask(index: number) {
  if(showList.value){
    const length = showList.value.length
    if(length > 0 && length > 3){
      return (Number(status.value) === Claim.Unclaimed && index >= length - 3)
    } else {
      return false
    }
  }
}

function getQuestionInfo(answer: Answer) {
  getQuestionConfig(answer.order).then(res => {
    const langs = Object.keys(res)
    const selectedLang = langs.includes(userLang1)
      ? userLang1
      : langs.includes(userLang2)
      ? userLang2
      : 'en'
    pageDirRtl.value = selectedLang === 'ar'
    const questions = res[selectedLang]
    const answers = answer.answers
    showList.value = questions.map((group, groupIndex) => {
      let answer = ''
      if (group.type === 'input') {
        answer = answers[groupIndex] || ''
      } else if (group.type === 'checkbox') {
        const answerArray = answers[groupIndex].split(',')
        answer = answerArray
          .map(item => {
            return group.answers[item] || ''
          })
          .join(', ')
      } else if (group.type === 'range') {
        const answerArray: number[] = []
        for (let ii = group.min; ii <= group.max; ii++) {
          answerArray.push(ii)
        }
        answer = answerArray[answers[groupIndex]]
      } else {
        answer = group.answers[answers[groupIndex]] || ''
      }
      return {
        question: group.question || '',
        answer
      }
    })
  })
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
      const open = {
        ...questionInfo.value?.open,
        status: Claim.Received,
        amount: res?.open?.amount,
        ctit_amount: res?.open?.ctit_amount
      }
      status.value = Claim.Received
      questionInfo.value = { ...questionInfo.value, open }
      // Update user information
      const userLol = String(Number(useUserStore().userInfo?.lol || 0) + Number(res?.open?.amount))
      useUserStore().updateUserInfo({ ...res?.user, ...res?.userPhysical })
      if(res.equip != null){
        useEqptStore().update([res?.equip])
      }
      // Throwing events
      pubSubUtil.emit(SubName.OpenPrank, { id, open: res?.open })
      prankStore.changeUnclaimed()
    })
    .catch(e => {
      prankLoading.value = false
      if (e.code === ErrorCodeEnum.NoStamina) {
        // Without physical strength
        ToastManager().showToast('No stamina', 'warn')
      } else if (e.code === ErrorCodeEnum.NoEggEndurance) {
        modalVisible.value = true
        // Equipment lacks durability
        // ToastManager().showToast('No egg endurance', 'warn')
      }
    })
}

const goBack = () => {
  router.back()
}

const onModalClose = () => {
  modalData.value ={
    visible: false,
    amount: '0',
    ctit_amount: '0'
  }
}

const returnNum = computed(() => {
    if(Number(questionInfo?.value?.open?.ctit_amount) > 0){
        return String(commonNumberFormat(Number(questionInfo?.value?.open?.ctit_amount) + Number(questionInfo?.value?.open?.amount)))
    } else {
        return String(commonNumberFormat(Number(questionInfo?.value?.open?.amount)))
    }
})

  function seenDetail(){
    modalVisible.value = false
    pubSubUtil.emit(SubName.OpenEquipmentInfo, {
    eqptList: useEqptStore().eqptList,
    defaultEqptId: useEqptStore().currentEqpt?.equip_id
  })
  }

</script>

<style lang="less" scoped>
.prank-answer-detail-all {
  margin-top: 1rem;
  padding-left: 3rem;
  padding-right: 3rem;

  .prank-answer-detail {
    width: 100%;
    height: 100%;
    padding-bottom: 7.2rem;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 4.4rem;
      position: fixed;
      top: 1rem;
      left: 0;
      right: 0;
      padding-left: 3rem;
      padding-right: 3rem;

      .button-container {
        width: 3.6rem;
        height: 3.6rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 13px solid transparent;
        border-image: url('@/assets/bg/btn-purple.svg') 13 fill stretch;
        border: 10px solid transparent;
        border-image: url('@/assets/border/purple-2.svg') 10 fill stretch;

        .button-content {
          display: flex;
          align-items: center;
          position: relative;

          .back {
            width: 0.8rem;
            height: 1.6rem;
            margin-left: -0.2rem;
          }
        }
      }

      .header-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .crit {
            width: 4.5rem;
            height: 2.4rem;
          }
        .right {
          display: flex;
          align-items: center;

          .crit {
            width: 4.5rem;
            height: 2.4rem;
          }

          .ctit-text {
            font-size: 1.4rem;
            line-height: 2.4rem;
            color: #ea4335;
            margin-left: 0.3rem;
            font-family: PixeloidSans-Bold;
          }

          .center-lol {
                width: 2.1rem;
                height: 2rem;
                margin-right: 0.2rem;
              }
        }

        .right-bottom {
          display: flex;
          flex-direction: row;
          align-items: center;

          .center-lol {
                width: 2.1rem;
                height: 2rem;
                margin-right: 0.2rem;
              }

          .lol {
            font-size: 1.4rem;
            line-height: 2rem;
            color: #ffd83e;
            font-family: PixeloidSans;
            align-self: flex-end;
            margin-left: -0.2rem;
          }

          .amount {
            font-size: 2.2rem;
            color: #ffd83e;
            font-family: PixeloidSans-Bold;
          }
        }
      }
    }

    .nick-wrap {
      margin-top: 6rem;

      .nick {
        font-size: 2.2rem;
        line-height: 4rem;
        color: #fff;
        font-family: PixeloidSans-Bold;
      }

      .time {
        font-size: 1.2rem;
        line-height: 2.4rem;
        color: #b5bfc9;
        font-family: PixeloidSans;
        margin-top: -0.7rem;
      }
    }

    .prank-answer-content {
      margin-top: 2.5rem;
      padding-bottom: 5.2rem;
      height: 100%;

      .prank-answer-item {
        margin-bottom: 1.4rem;
        font-size: 1.4rem;
        line-height: 2.2rem;
        max-width: 100%;
        font-family: PixeloidSans;

        .question {
          color: #fff;
        }

        .answer {
          color: #869aa9;
        }

        .answer-mask {
          height: 1.6rem;
          background-color: #869aa9;

          &.M1 {
            width: 5rem;
          }

          &.M2 {
            width: 9rem;
          }

          &.M2 {
            width: 14rem;
          }

          &.M3 {
            width: 19rem;
          }

          &.M4 {
            width: 22rem;
          }

          &.M4 {
            width: 26rem;
          }
        }
      }

      &.content-dir-rtl {
        direction: rtl;
      }
    }
  }

  .bottom-btn-wrap {
    position: fixed;
    // bottom: calc(constant(safe-area-inset-bottom));
    bottom: 1rem;
    bottom: calc(1rem + constant(safe-area-inset-bottom));
    bottom: calc(1rem + env(safe-area-inset-bottom));
    padding-bottom: 0;
    left: 0;
    right: 0;
    // padding-bottom: calc(constant(safe-area-inset-bottom));
    // padding-bottom: calc(env(safe-area-inset-bottom));
    padding-left: 4rem;
    padding-right: 5.1rem;
    padding-top: 1.8rem;
    padding-bottom: 1rem;
    background-color: rgba(0, 0, 0, 0.8);

    .bottom-button {
      height: 5.4rem;
      width: 100%;
    }
    .bottom-button-yellow.button-container {
      height: 5.4rem;
      width: 100%;
      border-image: url('@/assets/bg/btn-yellow.svg') 13 fill stretch;
    }
  }
  .detail-btn {
      height: 5.4rem;
      width: 2.84rem;
  }
}
</style>
