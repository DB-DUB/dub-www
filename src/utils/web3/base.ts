import { WalletType, Web3Error } from '@/api/model/web3'
import { getDeviceInfo } from '../common'
import { PublicKey } from '@solana/web3.js'
import { SubName, pubSubUtil } from '../pub-sub'
import ToastManager from '@/components/Toast/ToastManager'
import { ErrorCodeEnum } from '@/api/model/enums'

const DUB_DECIMALS = 1000000000
// Solana environment
const solanaEnv = import.meta.env.VITE_WEB3_SOLANA_ENV
// Official receiving sol address
const solIncomePubKey = new PublicKey(import.meta.env.VITE_WEB3_SOL_INCOME_ADDRESS)
// Official collection dub address
const dubIncomePubKey = new PublicKey(import.meta.env.VITE_WEB3_DUB_INCOME_ADDRESS)
// Official address for charging gas4dub fees
const gas4DubIncomePubKey = new PublicKey(import.meta.env.VITE_WEB3_GAS4DUB_INCOME_ADDRESS)
// Official address for charging gas4NFT fees
const gas4NftIncomePubKey = new PublicKey(import.meta.env.VITE_WEB3_GAS4NFT_INCOME_ADDRESS)
// Official nft transfer address
const nftIncomPubKey = new PublicKey(import.meta.env.VITE_WEB3_NFT_INCOME_ADDRESS)
// Official dub casting address
const dubMintPubKey = new PublicKey(import.meta.env.VITE_WEB3_DUB_MINT_ADDRESS)
// Official nft casting collection address
const nftMintColAddress = import.meta.env.VITE_WEB3_NFT_MINT_COL_ADDRESS
// web3 error code
const web3ErrorCode = -1
// burn eqpt fix gas
const burnEqptFixGas = 0.00001
// draw eqpt fix sol
const drawEqptFixSOL = 0.1
// burn eqpt time limit
const burnEqptTimeLimit = 10 * 60 * 60 * 1000
// exchange DUB&LOL
const exchange = {
  tokenRelease: import.meta.env.VITE_FLAG_TOKEN_RELEASE === 'true',
  tokenAirdrop: import.meta.env.VITE_FLAG_TOKEN_AIRDROP === 'true',
  // DUB -> LOL exchange Rate
  rate: 0.1,
  DUB2LOL: {
    max: 100000,
    min: 2,
    unit: 100,
    unitStr: '00'
  },
  LOL2DUB: {
    max: 100000,
    min: 200,
    unit: 10,
    unitStr: '0'
  },
  jupiterUrl: 'https://jup.ag/swap/SOL-DUB'
}

const alchemyPay = {
  appId: import.meta.env.VITE_PAY_APP_ID,
  appSecret: import.meta.env.VITE_PAY_APP_SECRET
}

export function useWeb3Const() {
  return {
    DUB_DECIMALS,
    solanaEnv,
    solIncomePubKey,
    dubIncomePubKey,
    gas4DubIncomePubKey,
    gas4NftIncomePubKey,
    nftIncomPubKey,
    dubMintPubKey,
    nftMintColAddress,
    web3ErrorCode,
    burnEqptFixGas,
    drawEqptFixSOL,
    burnEqptTimeLimit,
    exchange,
    alchemyPay
  }
}

export function useProvider(walletType: WalletType, autoHandle = true) {
  let provider
  switch (walletType) {
    case WalletType.Phantom:
      provider = usePhantomProvider(autoHandle)
      break
    case WalletType.Okx:
      provider = useOkxProvider(autoHandle)
      break
  }
  if (provider == null) {
    throw useWeb3Error(Web3Error.NoProvider)
  }
  return provider
}

export function useWeb3Error(message?: Web3Error, data?: any) {
  if (message === Web3Error.NotBindWallet) {
    pubSubUtil.emit(SubName.BindWallet)
  }
  return { code: ErrorCodeEnum.Web3Error, message, data }
}

export function isInPhantomApp() {
  if ('phantom' in window && isMobile()) {
    const provider = (window.phantom as any)?.solana
    if (provider?.isPhantom && !provider?.isOKExWallet) {
      return true
    }
  }
  return false
}

export function isInOkxApp() {
  if (typeof (window as any).okxwallet !== 'undefined' && isMobile()) {
    return true
  }
  return false
}

function usePhantomProvider(autoHandle: boolean) {
  if ('phantom' in window) {
    const provider = (window.phantom as any)?.solana
    if (provider?.isPhantom && !provider?.isOKExWallet) {
      return provider
    }
  }
  if (autoHandle) {
    if (isMobile()) {
      pubSubUtil.emit(SubName.OpenPhantomWithUrl)
    } else {
      window.open('https://phantom.app/', '_blank')
    }
  }
}

function useOkxProvider(autoHandle: boolean) {
  if (typeof (window as any).okxwallet !== 'undefined') {
    return (window as any).okxwallet.solana
  }
  if (autoHandle) {
    if (isMobile()) {
      pubSubUtil.emit(SubName.OpenOkxWithUrl)
    } else {
      window.open('https://www.okx.com/cn/web3', '_blank')
    }
  }
}

function isMobile() {
  const { isIOS, isAndroid } = getDeviceInfo()
  return isIOS || isAndroid
}

export function handleWeb3Error(e) {
  console.error(e)
  if (
    e.code === ErrorCodeEnum.Web3Error &&
    e.message !== Web3Error.NotBindWallet &&
    e.message !== Web3Error.NoProvider
  ) {
    if (e.message === Web3Error.UserRejectTx) {
      ToastManager().showToast('Transaction cancel', 'error')
    } else if (e.message === Web3Error.PubKeyNotMatch) {
      ToastManager().showToast('Use your connected wallet', 'error')
    } else if (e.message === Web3Error.NotEnoughDUB) {
      ToastManager().showToast('Not enough $DUB', 'error')
    } else if (e.message === Web3Error.NotEnoughLOL) {
      ToastManager().showToast('Not enough LOL', 'error')
    } else {
      ToastManager().showToast('Error', 'error')
    }
  } else if (e.code !== -1) {
    ToastManager().showToast('Serve Error', 'error')
  }
}
