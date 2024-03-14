import isEmpty from 'lodash-es/isEmpty'
import { TokenStandard, transferV1 } from '@metaplex-foundation/mpl-token-metadata'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { useProvider, useWeb3Const, useWeb3Error } from './base'
import { WalletType, Web3Error } from '@/api/model/web3'
import { useBlockHash, useConnection, useDUB, usePubkey, useUmi } from './connection'
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress
} from '@solana/spl-token'
import {
  fromWeb3JsPublicKey,
  toWeb3JsLegacyTransaction
} from '@metaplex-foundation/umi-web3js-adapters'
import pollSignatureStatus from './pollSignatureStatus'
import { useUserStoreWithOut } from '@/stores/modules/user'

export async function useExchangeLOLTx(dub: number, walletType: WalletType, pubKey?: PublicKey) {
  if (pubKey == null) {
    pubKey = await usePubkey(walletType)
  }
  await checkPubKey(pubKey)
  const { acctPubKey } = await useDUB(pubKey)
  if (acctPubKey == null) {
    throw useWeb3Error(Web3Error.NotEnoughDUB)
  }
  const ata = await getAssociatedTokenAddress(
    useWeb3Const().dubMintPubKey, // Mint
    useWeb3Const().dubIncomePubKey
  )
  const tx = new Transaction().add(
    createTransferCheckedInstruction(
      acctPubKey, // from (should be a token account)
      useWeb3Const().dubMintPubKey, // Mint
      ata, // to (should be a token account)
      pubKey, // from's owner
      dub * useWeb3Const().DUB_DECIMALS, // amount, if your deciamls is 8, send 10^8 for 1 token
      8 // Decimals
    )
  )
  tx.recentBlockhash = await useBlockHash()
  tx.feePayer = pubKey
  return tx
}

export async function useExchangeDUBTx(gas: number, walletType: WalletType) {
  const pubKey = await usePubkey(walletType)
  await checkPubKey(pubKey)
  const { acctPubKey } = await useDUB(pubKey)
  let tx = new Transaction()
  // First check if the user has a DUB account without creating one first.
  if (acctPubKey == null) {
    const ata = await getAssociatedTokenAddress(
      useWeb3Const().dubMintPubKey, // Mint
      pubKey
    )
    tx.add(
      createAssociatedTokenAccountInstruction(
        pubKey, // Payer
        ata, // Ata
        pubKey, // Owner
        useWeb3Const().dubMintPubKey // Mint
      )
    )
  }
  tx.add(
    SystemProgram.transfer({
      fromPubkey: pubKey,
      toPubkey: useWeb3Const().gas4DubIncomePubKey,
      lamports: gas * LAMPORTS_PER_SOL
    })
  )
  tx.recentBlockhash = await useBlockHash()
  tx.feePayer = pubKey
  return tx
}

export async function useDrawEqptTrans(walletType: WalletType, num = 1) {
  const pubKey = await usePubkey(walletType)
  await checkPubKey(pubKey)
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: pubKey,
      toPubkey: useWeb3Const().solIncomePubKey,
      lamports: useWeb3Const().drawEqptFixSOL * num * LAMPORTS_PER_SOL
    })
  )
  tx.recentBlockhash = await useBlockHash()
  tx.feePayer = pubKey
  return tx
}

export async function useBurnEqptTrans(mintAddress: string, walletType: WalletType) {
  const pubKey = await usePubkey(walletType)
  await checkPubKey(pubKey)
  const umi = useUmi(walletType)
  const blockhash = await useBlockHash()
  const tb = transferV1(umi, {
    mint: fromWeb3JsPublicKey(new PublicKey(mintAddress)),
    destinationOwner: fromWeb3JsPublicKey(useWeb3Const().nftIncomPubKey),
    tokenStandard: TokenStandard.NonFungible
  })
    .add(
      transferSol(umi, {
        destination: fromWeb3JsPublicKey(useWeb3Const().gas4NftIncomePubKey),
        amount: {
          decimals: 9,
          identifier: 'SOL',
          basisPoints: BigInt(useWeb3Const().burnEqptFixGas * LAMPORTS_PER_SOL)
        }
      })
    )
    .setBlockhash(blockhash)
  const tx = toWeb3JsLegacyTransaction(tb.build(umi))
  return tx
}

export async function useGas(tx: Transaction) {
  const gas = await tx.getEstimatedFee(useConnection())
  return gas == null ? 0 : gas / LAMPORTS_PER_SOL
}

export async function sendAndConfirmTrans(tx: Transaction, walletType: WalletType) {
  try {
    const { signature } = await useProvider(walletType).signAndSendTransaction(tx)
    return pollSignatureStatus(signature, useConnection())
  } catch (e) {
    if (String(e).indexOf('User rejected the request.') !== -1) {
      throw useWeb3Error(Web3Error.UserRejectTx)
    } else {
      throw useWeb3Error()
    }
  }
}

export async function checkPubKey(pubKey: PublicKey) {
  if (
    !isEmpty(useUserStoreWithOut().address) &&
    pubKey.toBase58() !== useUserStoreWithOut().address
  ) {
    throw useWeb3Error(Web3Error.PubKeyNotMatch)
  }
  return Promise.resolve()
}
