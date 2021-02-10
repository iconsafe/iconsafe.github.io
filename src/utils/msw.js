import store from '@src/store'
import { MultiSigWalletScore } from '@src/SCORE/MultiSigWalletScore'
import { useDispatch, useSelector } from 'react-redux'
import * as dispatchers from '@src/store/actions'

export const getMultiSigWalletAPI = (scoreAddress) => {
  const networkConnected = store.getState().networkConnected
  return new MultiSigWalletScore(networkConnected, scoreAddress)
}

export const isWalletOwner = (walletConnected, walletOwners) => {
  if (!walletConnected || !walletOwners) return false
  const walletOwnersAddresses = walletOwners.map(walletOwner => walletOwner.address)
  return walletOwnersAddresses.includes(walletConnected)
}

export const logout = (msw) => {
  const dispatch = useDispatch()
  msw.logout()
  dispatch(dispatchers.setWalletConnected(null))
  dispatch(dispatchers.setWalletProvider(null))
}

export const hashToEvents = (msw, hash) => {
  return msw.txResult(hash).then(result => {
    const events = []
    result.eventLogs.forEach(eventLog => {
      const eventSignature = eventLog.indexed[0]

      switch (eventSignature) {
        // Balance History Manager
        case 'BalanceHistoryCreated(int)':
          events.push({
            name: eventSignature.split('(')[0],
            balance_history_uid: parseInt(eventLog.indexed[1])
          })
          break
        // Transaction Manager
        case 'TransactionCreated(int,int)':
          events.push({
            name: eventSignature.split('(')[0],
            transaction_uid: parseInt(eventLog.indexed[1]),
            wallet_owner_uid: parseInt(eventLog.data[0])
          })
          break
        case 'TransactionCancelled(int,int)':
          events.push({
            name: eventSignature.split('(')[0],
            transaction_uid: parseInt(eventLog.indexed[1]),
            wallet_owner_uid: parseInt(eventLog.data[0])
          })
          break
        case 'TransactionExecutionSuccess(int,int)':
          events.push({
            name: eventSignature.split('(')[0],
            transaction_uid: parseInt(eventLog.indexed[1]),
            wallet_owner_uid: parseInt(eventLog.data[0])
          })
          break
        case 'WalletOwnersRequiredChanged(int)':
          events.push({
            name: eventSignature.split('(')[0],
            required: parseInt(eventLog.indexed[1])
          })
          break
        case 'TransactionRejectionSuccess(int,int)':
          events.push({
            name: eventSignature.split('(')[0],
            transaction_uid: parseInt(eventLog.indexed[1]),
            wallet_owner_uid: parseInt(eventLog.data[0])
          })
          break
        case 'TransactionExecutionFailure(int,int,str)':
          events.push({
            name: eventSignature.split('(')[0],
            transaction_uid: parseInt(eventLog.indexed[1]),
            wallet_owner_uid: parseInt(eventLog.data[0]),
            error: eventLog.data[1]
          })
          break
        case 'TransactionConfirmed(int,int)':
          events.push({
            name: eventSignature.split('(')[0],
            transaction_uid: parseInt(eventLog.indexed[1]),
            wallet_owner_uid: parseInt(eventLog.indexed[2])
          })
          break
        case 'TransactionRevoked(int,int)':
          events.push({
            name: eventSignature.split('(')[0],
            transaction_uid: parseInt(eventLog.indexed[1]),
            wallet_owner_uid: parseInt(eventLog.indexed[2])
          })
          break
        case 'TransactionRejected(int,int)':
          events.push({
            name: eventSignature.split('(')[0],
            transaction_uid: parseInt(eventLog.indexed[1]),
            wallet_owner_uid: parseInt(eventLog.indexed[2])
          })
          break
        // Wallet Owner Manager
        case 'WalletOwnerAddition(int)':
          events.push({
            name: eventSignature.split('(')[0],
            wallet_owner_uid: parseInt(eventLog.indexed[1])
          })
          break
        case 'WalletOwnerRemoval(int)':
          events.push({
            name: eventSignature.split('(')[0],
            wallet_owner_uid: parseInt(eventLog.indexed[1])
          })
          break
        case 'WalletSettingsSafeNameChanged(str)':
          events.push({
            name: eventSignature.split('(')[0],
            safe_name: eventLog.data[0]
          })
          break
      }
    })

    return events
  })
}

export const getTransactionState = (transaction) => {
  switch (transaction.type) {
    case 'CLAIM_ISCORE':
      // Claim I-Score cannot fail
      return 'EXECUTED'

    case 'INCOMING':
      // Incoming transaction cannot fail
      return 'EXECUTED'

    case 'OUTGOING':
      switch (transaction.state) {
        case 'EXECUTED':
          return 'EXECUTED'
        case 'FAILED':
          return 'FAILED'
        case 'REJECTED':
          return 'REJECTED'
        case 'WAITING':
          return 'WAITING'
        case 'CANCELLED':
          return 'CANCELLED'
        default:
          return 'UNKNOWN'
      }

    default:
      return 'UNKNOWN'
  }
}
