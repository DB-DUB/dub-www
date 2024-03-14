import { defineStore } from 'pinia'

import store from '@/stores'
import { EquipmentModel } from '@/api/model/equipment'
import { useEqptStore } from './eqpt'
import { PrankEnum, PrankInfo } from '@/api/model/question'
export interface PrankState {
    // Unclaimed quantity
    unclaimedNum: number
    // The currently displayed equipment
    currentShowEqpt: EquipmentModel
    //   Displayed Prank Type
    prankType: PrankEnum
    // list
    prankInfo: PrankInfo
}

export const usePrankStore = defineStore({
    id: 'app-prank',
    state: (): PrankState => ({
        unclaimedNum: 0,
        currentShowEqpt: useEqptStore().currentEqpt,
        prankType: PrankEnum.None,
        prankInfo: { total: 0, total_unclaimed: 0, list: [] }
    }),
    getters: {},
    persist: [],
    actions: {
        init() {
            if (useEqptStore().currentEqpt) {
                this.currentShowEqpt = useEqptStore().currentEqpt
            }
        },
        setInfo(info: PrankInfo){
            this.prankInfo = info
        },
        setType(type: PrankEnum){
            this.prankType = type
        },
        setShowEqpt(eqpt: EquipmentModel) {
            this.currentShowEqpt = eqpt
        },
        clearShowEqpt() {
            this.currentShowEqpt = useEqptStore().currentEqpt
        },
        setClaimed(num: number) {
            this.unclaimedNum = num
        },
        changeUnclaimed() {
            this.unclaimedNum--
        },
        clearUnclaimed() {
            this.unclaimedNum = 0
        }
    }
})

// Need to be used outside the setup
export function useEqptStoreWithOut() {
    return usePrankStore(store)
}
