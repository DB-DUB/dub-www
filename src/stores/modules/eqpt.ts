import { Transaction } from '@solana/web3.js'
import { defineStore } from 'pinia'
import store from '@/stores'
import { EquipStatus, EquipmentGrade, EquipmentModel } from '@/api/model/equipment'
import {
  equipmentAddAttrPoint,
  fixEquipmentDurability,
  getEqpt2List,
  getEquipmentInfo,
  mergeEquipment,
  mintEquipment,
  upgradeEquipment,
  wearEquipment
} from '@/api/equipment'
import { processDrawEqpt, processBurnEqpt } from '@/api/web3'
import { isEqpt3, sortEqptList, useEqptUpradeLol } from '@/utils/eqptUtil'
import { watch } from 'vue'
import { useUserStore, useUserStoreWithOut } from './user'
import isEmpty from 'lodash-es/isEmpty'
import { SubName, pubSubUtil } from '@/utils/pub-sub'
import { TxCheckType } from '@/api/model/web3'

export interface EqptState {
  /** 2.0(serve include nft) Equipment Collection*/
  _eqptList: EquipmentModel[]
}

let subLogoutKey
let disposeAddress
export const useEqptStore = defineStore({
  id: 'app-eqpt',
  state: (): EqptState => ({
    _eqptList: []
  }),
  getters: {
    // Current equipment
    currentEqpt: state => state._eqptList.find(item => item.wear_status === EquipStatus.Equipped),
    // 2.0+3.0 equipment collection
    eqptList: state => sortEqptList(state._eqptList),
    // merge eqptList
    eqptListForMerge: state =>
      sortEqptList(state._eqptList).filter(
        i => !isEqpt3(i) && i.grade !== EquipmentGrade.G1 && i.wear_status !== EquipStatus.Equipped
      ),
    eqptTabBadge: state =>
      state._eqptList.some(item => {
        return (
          !isEqpt3(item) &&
          item?.level < 10 &&
          item.grade !== EquipmentGrade.G1 &&
          Number(useUserStore().userInfo?.lol) >= useEqptUpradeLol(item)
        )
      })
  },
  persist: [],
  actions: {
    // Initialize equipment collection
    register() {
      subLogoutKey = pubSubUtil.on(SubName.Logout, () => {
        this.reset()
      })
      disposeAddress = watch(
        () => useUserStoreWithOut().address,
        address => {
          if (!isEmpty(address)) {
            this.sync()
          }
        }
      )
    },
    dispose() {
      subLogoutKey && pubSubUtil.off(subLogoutKey)
      disposeAddress && disposeAddress()
    },
    sync() {
      this.sync2()
    },
    sync2() {
      getEqpt2List().then(resp => {
        this._eqptList = resp.list
      })
    },
    fetchEquipmentInfo(params: { id?: string; mint_address?: string }) {
      getEquipmentInfo(params).then(resp => {
        this.update([resp.equip])
      })
    },
    equip(eqpt: EquipmentModel) {
      const index = this._eqptList.findIndex(i => i.id === eqpt.id)
      if (index >= 0) {
        const equipItem = this._eqptList.find(i => i.wear_status === EquipStatus.Equipped)
        if (equipItem != null) {
          pubSubUtil.emit(SubName.EquipEgg, eqpt)
          this.update([
            { ...equipItem, wear_status: EquipStatus.UnEquip },
            { ...eqpt, wear_status: EquipStatus.Equipped }
          ])
        }
      }
    },
    // Update equipment
    update(eqptList: EquipmentModel[]) {
      eqptList.forEach(eqpt => {
        const index = this._eqptList.findIndex(item => eqpt.equip_id === item.equip_id)
        if (index > -1) {
          this._eqptList[index] = eqpt
        } else {
          this._eqptList.push(eqpt)
        }
      })
    },
    // mint equipment 2.0->3.0
    async mint(eqpt: EquipmentModel) {
      const resp = await mintEquipment({ id: eqpt.id })
      const eqpt3: EquipmentModel = { ...eqpt, mint_address: resp.mint_address, id: undefined }
      this.update([eqpt3])
      pubSubUtil.emit(SubName.MintEgg, eqpt)
      return eqpt3
    },
    // burn equipment 3.0->2.0
    async burn(tx: Transaction, eqpt: EquipmentModel) {
      const resp = await processBurnEqpt(tx, eqpt.mint_address)
      const eqpt2: EquipmentModel = { ...eqpt, mint_address: undefined, id: resp.equip.id }
      this.update([eqpt2])
      return eqpt2
    },
    // equip req
    wear(eqpt: EquipmentModel) {
      return wearEquipment({ id: eqpt.id }).then(() => {
        this.equip(eqpt)
      })
    },
    fix(id) {
      return fixEquipmentDurability({ id: id }).then(() => {
        this.fetchEquipmentInfo({ id: id })
      })
    },
    upgrade(id) {
      return upgradeEquipment({ id: id }).then(resp => {
        // success or fail all consume lol
        useUserStore().updateUserInfo({ lol: resp?.user?.lol })
        // fail also will update level
        return getEquipmentInfo({ id: id }).then(infoResp => {
          this.update([infoResp.equip])
          return resp
        })
      })
    },
    addEqptAttrPoint(id, params) {
      /** Increase attribute value*/
      return equipmentAddAttrPoint(params).then(resp => {
        /** Add success to retrieve prop details*/
        return getEquipmentInfo({ id: id }).then(infoResp => {
          this.update([infoResp.equip])
          return { resp, infoResp: infoResp.equip }
        })
      })
    },
    // Extract equipment
    async draw() {
      const resp = await processDrawEqpt()
      this._eqptList.push(resp.equip)
      return resp.equip
    },
    // Extract equipment 10
    async draw10() {
      const resp = await processDrawEqpt(TxCheckType.DrwaEqpt10)
      this._eqptList = this._eqptList.concat(resp.equip_list)
      return resp.equip_list
    },
    // Synthetic equipment
    async merge(mergeEqptList: EquipmentModel[]) {
      const equipIndex = mergeEqptList.findIndex(i => i.wear_status === EquipStatus.Equipped)
      const resp = await mergeEquipment(mergeEqptList.map(item => item.id))
      const fixEqpt: EquipmentModel = {
        ...resp.equip,
        wear_status: equipIndex >= 0 ? EquipStatus.Equipped : EquipStatus.UnEquip
      }
      const filterList: EquipmentModel[] = []
      for (const i of this._eqptList) {
        if (mergeEqptList.findIndex(e => e.id === i.id) === -1) {
          filterList.push(i)
        }
      }
      this._eqptList = filterList
      this._eqptList.push(fixEqpt)
      return fixEqpt
    },
    // Clear equipment collection
    reset() {
      this.$reset()
    }
  }
})

// Need to be used outside the setup
export function useEqptStoreWithOut() {
  return useEqptStore(store)
}
