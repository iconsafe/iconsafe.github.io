import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Safe.module'
import SafeHeader from '@components/Safe/SafeHeader'
import SafeTabChoser from '@components/Safe/SafeTabChoser'
import { getSafeAddressFromUrl } from '@src/utils/route'
import * as dispatchers from '@src/store/actions'
import { getTokenSymbol, getTokenBalance, getTokenDecimals } from '@src/utils/icon'
import { getMultiSigWalletAPI, hashToEvents } from '@src/utils/msw'
import { withSnackbar } from 'notistack'

const Safe = ({ enqueueSnackbar }) => {
  const safeAddressUrl = getSafeAddressFromUrl()
  const msw = getMultiSigWalletAPI(safeAddressUrl)
  const walletConnected = useSelector((state) => state.walletConnected)
  const dispatch = useDispatch()

  const refreshWalletOwners = (msw) =>
    async (dispatch, getState) => {
      Promise.all([msw.get_wallet_owners()]).then(([walletOwners]) => {
        dispatch(dispatchers.setWalletOwners(walletOwners))
      })
    }

  const refreshContractVersion = (msw) =>
    async (dispatch, getState) => {
      Promise.all([msw.get_version_number()]).then(([contractVersion]) => {
        dispatch(dispatchers.setContractVersion(contractVersion))
      })
    }

  const refreshLatestEvents = (msw, enqueueSnackbar) =>
    async (dispatch, getState) => {
      const { currentEvent, safeAddress } = getState()

      Promise.all([msw.get_events()]).then(([latestEvents]) => {
        latestEvents.some(latestEvent => {
          if (currentEvent && currentEvent.uid >= latestEvent.uid) {
            // Already processed event
            return true
          }

          hashToEvents(msw, latestEvent.hash).then(events => {
            currentEvent !== null &&
              events.forEach(event => {
                switch (event.name) {
                  case 'TransactionCreated':
                    enqueueSnackbar('A new transaction has been created', {
                      variant: 'info',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshLatestTransactions(msw))
                    break

                  case 'BalanceHistoryCreated':
                    enqueueSnackbar('The safe balance has been updated', {
                      variant: 'info',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshMultisigBalances(msw, safeAddress))
                    break

                  case 'TransactionCancelled':
                    enqueueSnackbar('A transaction has been cancelled', {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshLatestTransactions(msw))
                    break
                  case 'TransactionExecutionSuccess':
                    enqueueSnackbar('A transaction has been executed successfully', {
                      variant: 'success',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshLatestTransactions(msw))
                    break
                  case 'TransactionRejectionSuccess':
                    enqueueSnackbar('A transaction has been rejected', {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshLatestTransactions(msw))
                    break
                  case 'TransactionExecutionFailure':
                    enqueueSnackbar('A transaction has failed to be executed', {
                      variant: 'error',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshLatestTransactions(msw))
                    break
                  case 'TransactionConfirmed':
                    enqueueSnackbar('A transaction has been confirmed', {
                      variant: 'success',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshLatestTransactions(msw))
                    break
                  case 'TransactionRevoked':
                    enqueueSnackbar('A transaction has been revoked', {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshLatestTransactions(msw))
                    break
                  case 'TransactionRejected':
                    enqueueSnackbar('A transaction has been rejected', {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshLatestTransactions(msw))
                    break
                  case 'WalletOwnerAddition':
                    enqueueSnackbar('A new wallet owner has been added', {
                      variant: 'success',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshWalletOwners(msw))
                    break
                  case 'WalletOwnerRemoval':
                    enqueueSnackbar('A wallet owner has been removed', {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshWalletOwners(msw))
                    break
                  case 'WalletSettingsSafeNameChanged':
                    enqueueSnackbar('The safe name has been changed', {
                      variant: 'info',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(dispatchers.setSafeName(event.safe_name))
                    break
                }
              })
          })
        })

        console.log('currentEvent=', currentEvent)

        if (!currentEvent || currentEvent.uid !== latestEvents[0].uid) {
          dispatch(dispatchers.setCurrentEvent(latestEvents[0]))
        }

        dispatch(dispatchers.setLatestEvents(latestEvents))
      })
    }

  const refreshSafeName = (msw) =>
    async (dispatch, getState) => {
      Promise.all([msw.get_safe_name()]).then(([safeName]) => {
        dispatch(dispatchers.setSafeName(safeName))
      })
    }

  const refreshWalletOwnersRequired = (msw) =>
    async (dispatch, getState) => {
      Promise.all([msw.get_wallet_owners_required()]).then(([walletOwnersRequired]) => {
        dispatch(dispatchers.setWalletOwnersRequired(walletOwnersRequired))
      })
    }

  const refreshConnectedWalletOwner = (msw, walletConnected) =>
    async (dispatch, getState) => {
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

  const refreshLatestTransactions = (msw) =>
    async (dispatch, getState) => {
      Promise.all([msw.get_all_transactions()]).then(([latestTransactions]) => {
        dispatch(dispatchers.setLatestTransactions(latestTransactions))
      })
    }

  const refreshMultisigBalances = (msw, safeAddressUrl) =>
    async (dispatch, getState) => {
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

  useEffect(() => {
    // Reload everything
    dispatch(dispatchers.setSafeAddress(safeAddressUrl))
    dispatch(refreshLatestEvents(msw, enqueueSnackbar))
    dispatch(refreshWalletOwners(msw))
    dispatch(refreshContractVersion(msw))
    dispatch(refreshSafeName(msw))
    dispatch(refreshMultisigBalances(msw, safeAddressUrl))
    dispatch(refreshWalletOwnersRequired(msw))
    dispatch(refreshLatestTransactions(msw))
    dispatch(refreshConnectedWalletOwner(msw, walletConnected))
  }, [safeAddressUrl])

  useEffect(() => {
    // Check for new events regularly
    setInterval(() => {
      dispatch(refreshLatestEvents(msw, enqueueSnackbar))
    }, 1000 * 2)
  }, [])

  return (
    <div className={styles.root}>
      <SafeHeader />
      <SafeTabChoser />
    </div>
  )
}

export default withSnackbar(Safe)
