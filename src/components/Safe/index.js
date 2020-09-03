import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Safe.module'
import SafeHeader from '@components/Safe/SafeHeader'
import SafeTabChoser from '@components/Safe/SafeTabChoser'
import { getSafeAddressFromUrl } from '@src/utils/route'
import * as dispatchers from '@src/store/actions'
import { getTokenSymbol, getTokenBalance, getTokenDecimals } from '@src/utils/icon'
import { getMultiSigWalletAPI } from '@src/utils/msw'

export const refreshWalletOwners = (msw, dispatch) => {
  Promise.all([msw.get_wallet_owners()]).then(([walletOwners]) => {
    dispatch(dispatchers.setWalletOwners(walletOwners))
  })
}

export const refreshContractVersion = (msw, dispatch) => {
  Promise.all([msw.get_version_number()]).then(([contractVersion]) => {
    dispatch(dispatchers.setContractVersion(contractVersion))
  })
}

export const refreshSafeName = (msw, dispatch) => {
  Promise.all([msw.get_safe_name()]).then(([safeName]) => {
    dispatch(dispatchers.setSafeName(safeName))
  })
}

export const refreshWalletOwnersRequired = (msw, dispatch) => {
  Promise.all([msw.get_wallet_owners_required()]).then(([walletOwnersRequired]) => {
    dispatch(dispatchers.setWalletOwnersRequired(walletOwnersRequired))
  })
}

export const refreshConnectedWalletOwner = (msw, dispatch, walletConnected) => {
  walletConnected &&
    Promise.all([msw.get_wallet_owner_uid(walletConnected)]).then(([connectedWalletOwnerUid]) => {
      dispatch(dispatchers.setConnectedWalletOwnerUid(connectedWalletOwnerUid))
      msw.get_wallet_owner(connectedWalletOwnerUid).then(connectedWalletOwner => {
        dispatch(dispatchers.setSonnectedWalletOwner(connectedWalletOwner))
      })
    }).catch(error => {
      if (error.includes('WalletOwnerDoesntExist')) {
        msw.logout()
        dispatch(dispatchers.setWalletConnected(null))
        dispatch(dispatchers.setWalletProvider(null))
      }
    })
}

export const refreshLatestTransactions = (msw, dispatch) => {
  console.log('refreshLatestTransactions CALLED ...')
  Promise.all([msw.get_all_transactions()]).then(([latestTransactions]) => {
    console.log('dispatching latestTransactions length = ', latestTransactions.length)
    dispatch(dispatchers.setLatestTransactions(latestTransactions))
  })
}

export const refreshMultisigBalances = (msw, dispatch, safeAddressUrl) => {
  const getAssetInformation = (token) => {
    return Promise.all([
      getTokenSymbol(token),
      getTokenBalance(safeAddressUrl, token),
      getTokenDecimals(token)
    ]).then(([symbol, balance, decimals]) => {
      return {
        token: token,
        symbol: symbol,
        balance: balance,
        decimals: decimals,
        value: '? USD' // todo
      }
    })
  }
  Promise.all([msw.get_balance_trackers()]).then(([tokens]) => {
    Promise.all(tokens.map(tracker => getAssetInformation(tracker)))
      .then(multisigBalances => {
        dispatch(dispatchers.setMultisigBalances(multisigBalances))
      })
  })
}

const Safe = () => {
  const safeAddressUrl = getSafeAddressFromUrl()

  const msw = getMultiSigWalletAPI(safeAddressUrl)

  const walletConnected = useSelector((state) => state.walletConnected)
  const dispatch = useDispatch()

  useEffect(() => {
    // Reload everything
    dispatch(dispatchers.setSafeAddress(safeAddressUrl))
    refreshWalletOwners(msw, dispatch)
    refreshContractVersion(msw, dispatch)
    refreshSafeName(msw, dispatch)
    refreshMultisigBalances(msw, dispatch, safeAddressUrl)
    refreshWalletOwnersRequired(msw, dispatch)
    refreshConnectedWalletOwner(msw, dispatch, walletConnected)
    refreshLatestTransactions(msw, dispatch)
  }, [safeAddressUrl])

  return (
    <div className={styles.root}>
      <SafeHeader />
      <SafeTabChoser />
    </div>
  )
}

export default Safe
