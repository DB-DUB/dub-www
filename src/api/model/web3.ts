import { Transaction } from '@solana/web3.js'

/** Web3 wallet types*/
export enum WalletType {
  None = -1,
  Phantom = 1,
  Okx = 2
}

export enum Web3Error {
  /** No provider*/
  NoProvider,
  /** timeout verification*/
  Timeout,
  /** Unbound wallet*/
  NotBindWallet,
  /** not enough dub*/
  NotEnoughDUB,
  /** user reject tx*/
  UserRejectTx,
  /** pre burn eqpt check*/
  PreBurnEqptCheck,
  /** pubKey not match */
  PubKeyNotMatch,
  /** not enough ;ol*/
  NotEnoughLOL
}

export interface PreBurnEqptResp {
  /** Trading partners*/
  tx: Transaction
  /** sol balance*/
  sol: number
  /** gas fee*/
  gas: number
}

export enum TxCheckType {
  /**  1.to LOL*/
  ToLol = 1,
  /** 2.to $DUB*/
  ToDub = 2,
  /** 3. Draw equipment*/
  DrawEqpt = 3,
  /** 4.burn(destroy)*/
  BurnEqpt = 4,
  /** 5. Draw equipment 10 */
  DrwaEqpt10 = 5
}

export interface PreBurnEqptCheckResp {
  // Whether it can burn -1 No 1. Yes
  flag_mint: -1 | 1
  // The time of the last mint
  last_mint_time: string
  // How long does it take to mint, timestamp (s)
  mint_duration: number
}
