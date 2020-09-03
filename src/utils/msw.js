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

export const getTransactionState = (transaction) => {
  switch (transaction.type) {
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
        default:
          return 'UNKNOWN'
      }

    default:
      return 'UNKNOWN'
  }
}
