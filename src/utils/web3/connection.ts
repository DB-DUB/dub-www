import { PublicKey, Connection, LAMPORTS_PER_SOL, clusterApiUrl } from '@solana/web3.js'
import { WalletType } from '@/api/model/web3'
import { useProvider, useWeb3Const } from './base'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { getAssociatedTokenAddress } from '@solana/spl-token'

const connection = new Connection(useWeb3Const().solanaEnv)

export function useConnection() {
  return connection
}

export function useUmi(walletType: WalletType) {
  const umi = createUmi(useWeb3Const().solanaEnv).use(mplTokenMetadata())
  umi.use(walletAdapterIdentity(useProvider(walletType, false)))
  return umi
}

export async function usePubkey(walletType: WalletType): Promise<PublicKey> {
  const provider = useProvider(walletType)
  const resp = await provider.connect()
  return resp.publicKey
}

export async function useSOL(pubKey: PublicKey) {
  const balance = await useConnection().getBalance(pubKey)
  return balance / LAMPORTS_PER_SOL
}

export async function useDUB(pubKey: PublicKey) {
  return new Promise<{ acctPubKey?: PublicKey; dubAmt: number }>(async resolve => {
    const resp = await useConnection().getParsedTokenAccountsByOwner(pubKey, {
      mint: useWeb3Const().dubMintPubKey
    })
    let result
    for (const item of resp.value) {
      if (item.pubkey != null) {
        const tokenAccountBalance = await useConnection().getTokenAccountBalance(item.pubkey)
        result = { acctPubKey: item.pubkey, dubAmt: tokenAccountBalance.value.uiAmount }
        break
      }
    }
    if (result != null) {
      resolve(result)
    } else {
      resolve({ acctPubKey: undefined, dubAmt: 0 })
    }
  })
}

export async function useBlockHash() {
  const { blockhash } = await useConnection().getLatestBlockhash()
  return blockhash
}

export async function useAta(pubKey: PublicKey) {
  const ata = await getAssociatedTokenAddress(
    useWeb3Const().dubMintPubKey, // mint
    pubKey
  )
  return ata
}
