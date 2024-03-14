import { EquipStatus, EquipmentGrade, EquipmentModel } from '@/api/model/equipment'
import isEmpty from 'lodash-es/isEmpty'
import { upgradeConfig } from './eqptConfig'
import { uniqueId } from 'lodash-es'

export function useEqptName(grade?: EquipmentGrade) {
  switch (grade) {
    case EquipmentGrade.G1:
      return 'Baby Egg'
    case EquipmentGrade.G2:
      return 'Common Egg'
    case EquipmentGrade.G3:
      return 'Rare Egg'
    case EquipmentGrade.G4:
      return 'Epic Egg'
    case EquipmentGrade.G5:
      return 'Legendary Egg'
  }
  return 'Egg'
}

export function useEqptNameV2(grade?: EquipmentGrade) {
  switch (grade) {
    case EquipmentGrade.G1:
      return 'Baby'
    case EquipmentGrade.G2:
      return 'Common'
    case EquipmentGrade.G3:
      return 'Rare'
    case EquipmentGrade.G4:
      return 'Epic'
    case EquipmentGrade.G5:
      return 'Legendary'
  }
  return 'Egg'
}

export function useEqptUpradeLol(eqpt?: EquipmentModel) {
  return upgradeConfig.get(eqpt?.grade)?.get(eqpt?.level) || 0
}

export function useEqptCritical(eqpt?: EquipmentModel) {
  const lucky = Number(eqpt?.luck)
  if (isNaN(lucky)) {
    return 0
  } else {
    return lucky / (lucky + 60)
  }
}

export function sortEqptList(eqptList: EquipmentModel[]) {
  return eqptList.sort((i, j) => {
    const gradeDelta = j.grade - i.grade
    const levelDelta = j.level - i.level
    const eqpt3Detal = (isEqpt3(j) ? 0 : 1) - (isEqpt3(i) ? 0 : 1)
    if (gradeDelta === 0) {
      if (levelDelta === 0) {
        return eqpt3Detal
      } else {
        return levelDelta
      }
    } else {
      return gradeDelta
    }
  })
}

export function isEqpt3(eqpt: EquipmentModel) {
  return isEmpty(eqpt?.id)
}

export function useMockEqpt(grade?: EquipmentGrade, wearStatus?: EquipStatus, level?: number) {
  const eqpt: EquipmentModel = {
    equip_id: uniqueId(),
    id: uniqueId(),
    durability: Math.ceil(Math.random() * 100),
    durability_max: 100,
    level: level != null ? level : Math.floor(Math.random() * 10),
    grade: grade || EquipmentGrade.G2,
    endurance: Math.ceil(Math.random() * 100),
    free_attribute: grade === EquipmentGrade.G1 ? 0 : Math.ceil(Math.random() * 100),
    luck: Math.ceil(Math.random() * 100),
    power: Math.ceil(Math.random() * 100),
    wear_status: wearStatus || EquipStatus.UnEquip,
    url: 'https://pixelhobby-shop.de/cdn/shop/products/Kleine-Eier-9.png?v=1646042878&width=1100'
  }
  return eqpt
}

export function useMockEqptList() {
  return [
    useMockEqpt(EquipmentGrade.G1, EquipStatus.UnEquip, 1),
    useMockEqpt(EquipmentGrade.G2, EquipStatus.UnEquip, 1),
    useMockEqpt(EquipmentGrade.G3, EquipStatus.UnEquip, 1),
    useMockEqpt(EquipmentGrade.G5, EquipStatus.UnEquip, 1),
    useMockEqpt(EquipmentGrade.G2, EquipStatus.UnEquip, 1),
    useMockEqpt(EquipmentGrade.G2, EquipStatus.UnEquip, 1),
    useMockEqpt(EquipmentGrade.G3, EquipStatus.UnEquip, 1),
    useMockEqpt(EquipmentGrade.G4, EquipStatus.UnEquip, 1),
    useMockEqpt(EquipmentGrade.G2, EquipStatus.UnEquip, 1),
    useMockEqpt(EquipmentGrade.G2, EquipStatus.UnEquip, 1)
  ]
}
