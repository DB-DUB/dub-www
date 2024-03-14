import { useUserStoreWithOut } from '@/stores/modules/user'
import {
  PreBurnEqptCheckResp,
  PreBurnEqptResp,
  TxCheckType,
  WalletType,
  Web3Error
} from './model/web3'
import { useWeb3Const, useWeb3Error } from '@/utils/web3/base'
import { useDUB, useSOL } from '@/utils/web3/connection'
import { PublicKey, Transaction } from '@solana/web3.js'
import {
  sendAndConfirmTrans,
  useDrawEqptTrans,
  useBurnEqptTrans,
  useExchangeDUBTx,
  useExchangeLOLTx,
  useGas
} from '@/utils/web3/transaction'
import request from '@/utils/request'
import { EquipmentModel } from './model/equipment'
import { UserInfoModel } from './model/user'
import isEmpty from 'lodash-es/isEmpty'

export function getDub() {
  try {
    const { pubKey } = preparePubKey(true)
    return useDUB(pubKey)
  } catch (e) {
    return Promise.resolve(null)
  }
}

export async function calcGasorExchangeDub(dub: number) {
  const { pubKey, walletType } = preparePubKey(true)
  const tx = await useExchangeLOLTx(dub, walletType, pubKey)
  const gas = await useGas(tx)
  return gas
}

/**
 * DUB to LOL
 */
export async function processExchangeLOL(dub: number) {
  const { walletType } = preparePubKey()
  const tx = await useExchangeLOLTx(dub, walletType)
  const signature = await sendAndConfirmTrans(tx, walletType)
  return sendTxResult<{ user: Partial<UserInfoModel> }>(signature, TxCheckType.ToLol, {
    dub: String(dub)
  })
}

/**
 * LOL exchange for DUB
 */
export async function processExchangeDUB(lol: number) {
  // First, you need to get the exchanged gas fee from the backend.
  if (lol > Number(useUserStoreWithOut().userInfo.lol)) {
    throw useWeb3Error(Web3Error.NotEnoughLOL)
  }
  const { walletType } = preparePubKey()
  const { free } = await getToDubGas(lol)
  const tx = await useExchangeDUBTx(Number(free), walletType)
  const signature = await sendAndConfirmTrans(tx, walletType)
  return sendTxResult<{ user: Partial<UserInfoModel> }>(signature, TxCheckType.ToDub, {
    lol: String(lol)
  })
}

/**
 * Draw equipment
 */
export async function processDrawEqpt(type: TxCheckType = TxCheckType.DrawEqpt) {
  const { walletType } = preparePubKey()
  const tx = await useDrawEqptTrans(walletType, type === TxCheckType.DrwaEqpt10 ? 10 : 1)
  const signature = await sendAndConfirmTrans(tx, walletType)
  return sendTxResult<{ equip: EquipmentModel; equip_list: EquipmentModel[] }>(signature, type)
}

/**
 * Pre-burn 3.0 gear
 * @param mintAddress mint address
 */
export async function preBurnEqpt(mintAddress?: string): Promise<PreBurnEqptResp> {
  if (mintAddress == null) {
    throw mintAddress
  }
  const { pubKey, walletType } = preparePubKey()
  const tx = await useBurnEqptTrans(mintAddress, walletType)
  const resp = await request<PreBurnEqptCheckResp>({
    url: '/equip/burn_check',
    method: 'get',
    params: { mint_address: mintAddress }
  })
  if (resp.flag_mint === -1) {
    throw useWeb3Error(Web3Error.PreBurnEqptCheck, resp)
  }

  const sol = await useSOL(pubKey)
  const gas = await useGas(tx)
  return {
    tx,
    sol,
    gas: gas + useWeb3Const().burnEqptFixGas
  }
}

/**
 * burn 3.0 equipment
 */
export async function processBurnEqpt(tx: Transaction, mintAddress?: string) {
  const { walletType } = preparePubKey()
  const signature = await sendAndConfirmTrans(tx, walletType)
  return sendTxResult<{ equip: EquipmentModel }>(signature, TxCheckType.BurnEqpt, {
    mint_address: mintAddress
  })
}

function preparePubKey(handleErrorSelf?: boolean) {
  const userInfo = useUserStoreWithOut().userInfo
  if (isEmpty(userInfo.address) || userInfo.type == WalletType.None || userInfo.type == null) {
    if (!handleErrorSelf) {
      throw useWeb3Error(Web3Error.NotBindWallet)
    } else {
      throw null
    }
  }
  const pubKey = new PublicKey(userInfo.address as string)
  return { pubKey, walletType: userInfo.type }
}

function sendTxResult<T>(signature: string, type: TxCheckType, data?: any) {
  let params
  switch (type) {
    case TxCheckType.ToLol:
      params = { signature, type, data1: data }
      break
    case TxCheckType.ToDub:
      params = { signature, type, data2: data }
      break
    case TxCheckType.DrawEqpt:
    case TxCheckType.DrwaEqpt10:
      params = { signature, type }
      break
    case TxCheckType.BurnEqpt:
      params = { signature, type, data4: data }
      break
  }
  return request<T>({
    url: '/other/check',
    method: 'post',
    data: params
  })
}

function getToDubGas(lol: number) {
  return request<{ free: string }>({
    url: `/other/dub_free?lol=${lol}`,
    method: 'get'
  })
}
