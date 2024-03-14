import { defineStore } from 'pinia'
import store from '@/stores'
import { EquipmentModel } from '@/api/model/equipment'
import { SubName, pubSubUtil } from '@/utils/pub-sub'

interface EquipmentInfoModal {
  eqptList: EquipmentModel[]
  defaultEqptId: string
  visible: boolean
}
interface MergeEqptModal {
  visible: boolean
}
interface MergeEqptResultModal {
  visible: boolean
  isSuccess: boolean
  params?: EquipmentModel[]
  result?: EquipmentModel
}

interface OhterModal {
  visible: boolean
}
interface ModalState {
  equipmentInfoModal: EquipmentInfoModal
  mergeEqptModal: MergeEqptModal
  mergeEqptResultModal: MergeEqptResultModal
  otherModal: OhterModal
}

function defaultEquipmentInfoModal() {
  return {
    eqptList: [],
    defaultEqptId: '',
    visible: false
  }
}

function defaultMergeEqptModal() {
  return { visible: false }
}

function defaultMergeEqptResultModal() {
  return {
    visible: false,
    isSuccess: false,
    params: undefined,
    result: undefined
  }
}

function defaultOtherModal() {
  return { visible: false }
}

let subOpenEquipmentInfo,
  subCloseEquipmentInfo,
  subOpenMergeEqpt,
  subCloseMergeEqpt,
  subOpenMergeEqptResult,
  subCloseMergeEqptResult,
  subOpenOtherModal,
  subCloseOtherModal

export const useModalStore = defineStore({
  id: 'modal',
  state: (): ModalState => {
    return {
      equipmentInfoModal: defaultEquipmentInfoModal(),
      mergeEqptModal: defaultMergeEqptModal(),
      mergeEqptResultModal: defaultMergeEqptResultModal(),
      otherModal: defaultOtherModal()
    }
  },
  getters: {
    visible: state => {
      return (
        state.equipmentInfoModal.visible ||
        state.mergeEqptModal.visible ||
        state.mergeEqptResultModal.visible ||
        state.otherModal.visible
      )
    }
  },
  actions: {
    init() {
      subOpenEquipmentInfo = pubSubUtil.on(SubName.OpenEquipmentInfo, params => {
        this.equipmentInfoModal = {
          eqptList: params.eqptList,
          defaultEqptId: params.defaultEqptId,
          visible: true
        }
      })
      subCloseEquipmentInfo = pubSubUtil.on(SubName.CloseEquipmentInfo, () => {
        this.equipmentInfoModal = defaultEquipmentInfoModal()
      })
      subOpenMergeEqpt = pubSubUtil.on(SubName.OpenMergeEqpt, () => {
        this.mergeEqptModal = { visible: true }
      })
      subCloseMergeEqpt = pubSubUtil.on(SubName.CloseMergeEqpt, () => {
        this.mergeEqptModal = defaultMergeEqptModal()
      })
      subOpenMergeEqptResult = pubSubUtil.on(SubName.MergeEqptResult, params => {
        this.mergeEqptResultModal = {
          isSuccess: params.isSuccess,
          params: params.params,
          result: params.result,
          visible: true
        }
      })
      subCloseMergeEqptResult = pubSubUtil.on(SubName.CloseMergeEqptResult, () => {
        this.mergeEqptResultModal = defaultMergeEqptResultModal()
      })
      subOpenOtherModal = pubSubUtil.on(SubName.OpenOtherModal, () => {
        this.otherModal = { visible: true }
      })
      subCloseOtherModal = pubSubUtil.on(SubName.CloseOtherModal, () => {
        this.otherModal = defaultOtherModal()
      })
    },

    dispose() {
      subOpenEquipmentInfo && pubSubUtil.off(subOpenEquipmentInfo)
      subCloseEquipmentInfo && pubSubUtil.off(subCloseEquipmentInfo)
      subOpenMergeEqpt && pubSubUtil.off(subOpenMergeEqpt)
      subCloseMergeEqpt && pubSubUtil.off(subCloseMergeEqpt)
      subOpenMergeEqptResult && pubSubUtil.off(subOpenMergeEqptResult)
      subCloseMergeEqptResult && pubSubUtil.off(subCloseMergeEqptResult)
      subOpenOtherModal && pubSubUtil.off(subOpenOtherModal)
      subCloseOtherModal && pubSubUtil.off(subCloseOtherModal)
    }
  }
})

// Need to be used outside the setup
export function useModalStoreWithOut() {
  return useModalStore(store)
}
