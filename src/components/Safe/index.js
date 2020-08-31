import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Safe.module'
import SafeHeader from '@components/Safe/SafeHeader'
import SafeTabChoser from '@components/Safe/SafeTabChoser'
import { getSafeAddress } from '@src/utils/route'
import * as dispatchers from '@src/store/actions'
import { getTokenSymbol, getTokenBalance, getTokenDecimals } from '@src/utils/icon'
import { getMultiSigWalletAPI } from '@src/utils/msw'

const Safe = () => {
  const safeAddress = getSafeAddress()
  const msw = getMultiSigWalletAPI(safeAddress)

  const walletConnected = useSelector((state) => state.walletConnected)
  const forceReload = useSelector((state) => state.forceReload)
  const dispatch = useDispatch()

  useEffect(() => {
    const getAssetInformation = (token) => {
      return Promise.all([
        getTokenSymbol(token),
        getTokenBalance(safeAddress, token),
        getTokenDecimals(token)
      ]).then(([symbol, balance, decimals]) => {
        return {
          token: token,
          symbol: symbol,
          balance: balance,
          decimals: decimals,
          // todo
          value: '? USD'
        }
      })
    }

    if (forceReload) {
      walletConnected && msw.get_wallet_owner_uid(walletConnected).then(connectedWalletOwnerUid => {
        dispatch(dispatchers.setConnectedWalletOwnerUid(connectedWalletOwnerUid))
      })

      Promise.all([
        msw.get_version_number(),
        msw.get_wallet_owners(),
        msw.get_balance_trackers(),
        msw.get_wallet_owners_required()
      ]).then(([contractVersion, owners, tokens, walletOwnersRequired]) => {
        dispatch(dispatchers.setWalletOwners(owners))
        Promise.all(tokens.map(tracker => getAssetInformation(tracker)))
          .then(result => {
            dispatch(dispatchers.setContractVersion(contractVersion))
            dispatch(dispatchers.setMultisigBalances(result))
            dispatch(dispatchers.setForceReload(false))
            dispatch(dispatchers.setWalletOwnersRequired(walletOwnersRequired))
          })
      })
    }
  }, [safeAddress, forceReload])

  return (
    <div className={styles.root}>
      <SafeHeader />
      <SafeTabChoser />
    </div>
  )
}

export default Safe
