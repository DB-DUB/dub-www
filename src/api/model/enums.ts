export enum DeviceEnums {
  Mobile = 'mobile',
  Desktop = 'desktop'
}

export enum SpecialCodeEnum {
  Normal = 10000,
  NoAuthorization = 10005,
  ServiceError = 500,
  ServiceCustomError = 99999,
  LolNotEnoughError = 10021
}

export enum ErrorCodeEnum {
  Web3Error = -1,
  // Without physical strength
  NoStamina = 10022,
  // Equipment lacks durability
  NoEggEndurance = 10023,
  // Equip was traded away
  EqptTradedAway = 10024
}
