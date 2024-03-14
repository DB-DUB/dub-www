import request from '@/utils/request'
import { EquipmentModel } from '@/api/model/equipment'

/**
 * Equipment adds attribute points
 * @param params
 */
export function equipmentAddAttrPoint(params: {
  id: string
  power: number
  endurance: number
  luck: number
}) {
  return request({
    url: '/equip/add_little',
    method: 'post',
    data: params
  })
}

/**
 * Get prop details
 * @param params
 */
export function getEquipmentInfo(params: {
  id?: string
  mint_address?: string
}): Promise<{ equip: EquipmentModel }> {
  return request({
    url: `/equip/info?id=${params.id}&mint_address=${params.mint_address}`,
    method: 'get'
  })
}

/***
 * Get the price needed to repair durability (LOL)
 * @param params
 */
export function getFixDurabilityAmount(params: { id: string }): Promise<{ amount }> {
  return request({
    url: `/equip/fix_cost?id=${params.id}`,
    method: 'get'
  })
}

/***
 * Repair durability
 * @param params
 */
export function fixEquipmentDurability(params: { id: string }): Promise<{ amount }> {
  return request({
    url: `/equip/fix`,
    method: 'post',
    data: params
  })
}

/***
 * equipment
 * @param params
 */
export function wearEquipment(params: { id?: string }) {
  return request({
    url: `/equip/wear`,
    method: 'post',
    data: params
  })
}

/***
 * Upgrade equipment
 * @param params
 *
 * status 1. Success 2. Failure
 */
export function upgradeEquipment(params: {
  id: string
}): Promise<{ status: 1 | 2; user: { lol: string } }> {
  return request({
    url: `/equip/upgrade`,
    method: 'post',
    data: params
  })
}

/***
 * mint (get it to 3.0)
 * @param params
 */
export function mintEquipment(params: { id?: string }): Promise<{ mint_address: string }> {
  return request({
    url: `/equip/mint`,
    method: 'post',
    data: params
  })
}

/**
 * Get the 2.0 equipment collection
 */
export function getEqpt2List() {
  return request<{ list: EquipmentModel[] }>({
    url: '/equip/list',
    method: 'get'
  })
}

/**
 * Synthetic equipment
 */
export function mergeEquipment(id_list: (string | undefined)[]) {
  return request<{ equip: EquipmentModel }>({
    url: '/equip/merge',
    method: 'post',
    data: { id_list }
  })
}
