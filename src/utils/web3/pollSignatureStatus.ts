import { Connection } from '@solana/web3.js'
import { useWeb3Error } from './base'
import { Web3Error } from '@/api/model/web3'

const POLLING_INTERVAL = 1000 // one second
const MAX_POLLS = 30

/**
 * Polls for transaction signature statuses
 * @param   {String}     signature  a transaction signature
 * @param   {Connection} connection an RPC connection
 * @param   {Function}   createLog  a function to create log
 * @returns
 */
const pollSignatureStatus = (signature: string, connection: Connection): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    let count = 0
    const interval = setInterval(async () => {
      // Failed to confirm transaction in time
      if (count === MAX_POLLS) {
        clearInterval(interval)
        reject(useWeb3Error(Web3Error.Timeout))
        return
      }

      const resp = await connection.getSignatureStatus(signature)
      const confirmationStatus = resp?.value?.confirmationStatus
      console.log('solana getSignatureStatus resp', resp)
      if (confirmationStatus) {
        const hasReachedSufficientCommitment =
          confirmationStatus === 'confirmed' || confirmationStatus === 'finalized'
        if (hasReachedSufficientCommitment) {
          clearInterval(interval)
          resolve(signature)
          return
        }
      }

      count++
    }, POLLING_INTERVAL)
  })
}

export default pollSignatureStatus
