/**
 * Equipment details
 */
export interface EquipmentModel {
  /** id */
  equip_id: string
  /** 2.0 id*/
  id?: string
  /** 3.0 id */
  mint_address?: string
  /** Equipment picture address*/
  url: string
  /** grade*/
  level: number
  /** free attribute points*/
  free_attribute: number
  /** Current durability*/
  durability: number
  /** Maximum durability*/
  durability_max: number
  power: number
  /** Endurance (the higher it is, the lower the endurance consumption is each time)*/
  endurance: number
  /** Luck (the higher, the higher the chance of a critical hit)*/
  luck: number
  /** Quality 1.Initial equipment 2.Green 3.Blue 4.Gold 5.Red*/
  grade: EquipmentGrade
  /** 1. Not wearing 2. Wearing*/
  wear_status: EquipStatus
}

/**
 * Equipment quality
 * 1.Initial equipment 2.Green 3.Blue 4.Gold 5.Red
 */
export enum EquipmentGrade {
  G1 = 1,
  G2 = 2,
  G3 = 3,
  G4 = 4,
  G5 = 5
}

/**
 * Equipment status
 */
export enum EquipStatus {
  /** Not wearing*/
  UnEquip = 1,
  /** wear*/
  Equipped = 2
}
