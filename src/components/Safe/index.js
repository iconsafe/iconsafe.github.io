import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './Safe.module'
import SafeHeader from '@components/Safe/SafeHeader'
import SafeTabChoser from '@components/Safe/SafeTabChoser'
import { getSafeAddressFromUrl } from '@src/utils/route'
import * as dispatchers from '@src/store/actions'
import { getTokenSymbol, getTokenBalance, getTokenDecimals, displayUnit } from '@src/utils/icon'
import { getMultiSigWalletAPI, hashToEvents } from '@src/utils/msw'
import { withSnackbar } from 'notistack'
import { useRouteMatch } from 'react-router-dom'
import Link from '@components/core/Link'
import HeaderBar from '@components/HeaderBar'

const Safe = ({ enqueueSnackbar }) => {
  const safeAddressUrl = getSafeAddressFromUrl()
  const msw = getMultiSigWalletAPI(safeAddressUrl)
  const walletConnected = useSelector((state) => state.walletConnected)
  const dispatch = useDispatch()
  const match = useRouteMatch()

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

  const transactionLink = (uid) => {
    return `${match.url}/transactions?transaction=${uid}`
  }

  const refreshLatestEvents = (msw, enqueueSnackbar) =>
    async (dispatch, getState) => {
      const { currentEvent, safeAddress, multisigBalances } = getState()

      Promise.all([msw.get_events()]).then(([latestEvents]) => {
        latestEvents.some(latestEvent => {
          if (currentEvent && currentEvent.uid >= latestEvent.uid) {
            // Already processed event
            return true
          }

          const getTransactionLink = (uid) => (
            <Link style={{ color: 'white' }} to={transactionLink(uid)}>
              Click here to see it
            </Link>
          )

          currentEvent !== null && multisigBalances &&
            hashToEvents(msw, latestEvent.hash).then(events => {
              Promise.all(events.map(async event => {
                switch (event.name) {
                  case 'TransactionCreated': {
                    const owner = await msw.get_wallet_owner(event.wallet_owner_uid)
                    enqueueSnackbar(`A new transaction has been created by "${owner.name}"`, {
                      variant: 'info',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                      action: getTransactionLink(event.transaction_uid)
                    })
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'BalanceHistoryCreated': {
                    const entry = await msw.get_balance_history(event.balance_history_uid)
                    const token = multisigBalances.filter(balance => balance.token === entry.token)[0]
                    enqueueSnackbar(`Your ${token.symbol} balance has been updated : you now own ${parseFloat(displayUnit(entry.balance, token.decimals))} ${token.symbol}`, {
                      variant: 'info',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshMultisigBalances(msw, safeAddress))
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'TransactionCancelled': {
                    const owner = await msw.get_wallet_owner(event.wallet_owner_uid)
                    enqueueSnackbar(`A transaction has been cancelled by "${owner.name}"`, {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                      action: getTransactionLink(event.transaction_uid)
                    })
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'WalletOwnersRequiredChanged':
                    enqueueSnackbar(`The number of owners required for executing the transaction has changed to ${event.required}`, {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshWalletOwnersRequired(msw))
                    break

                  case 'TransactionExecutionSuccess': {
                    const owner = await msw.get_wallet_owner(event.wallet_owner_uid)
                    enqueueSnackbar(`A transaction has been executed successfully by "${owner.name}"`, {
                      variant: 'success',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                      action: getTransactionLink(event.transaction_uid)
                    })
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'TransactionRejectionSuccess': {
                    const owner = await msw.get_wallet_owner(event.wallet_owner_uid)
                    enqueueSnackbar(`A transaction has been rejected by "${owner.name}"`, {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                      action: getTransactionLink(event.transaction_uid)
                    })
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'TransactionExecutionFailure': {
                    const owner = await msw.get_wallet_owner(event.wallet_owner_uid)
                    enqueueSnackbar(`A transaction has failed to be executed by "${owner.name}"`, {
                      variant: 'error',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                      action: getTransactionLink(event.transaction_uid)
                    })
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'TransactionConfirmed': {
                    if (events.map(event => event.name).includes('TransactionExecutionSuccess')) {
                      return
                    }
                    const owner = await msw.get_wallet_owner(event.wallet_owner_uid)
                    enqueueSnackbar(`"${owner.name}" voted for confirming a transaction`, {
                      variant: 'success',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                      action: getTransactionLink(event.transaction_uid)
                    })
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'TransactionRevoked': {
                    const owner = await msw.get_wallet_owner(event.wallet_owner_uid)
                    enqueueSnackbar(`"${owner.name}" cancelled his vote on a transaction`, {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                      action: getTransactionLink(event.transaction_uid)
                    })
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'TransactionRejected': {
                    if (events.map(event => event.name).includes('TransactionRejectionSuccess')) {
                      return
                    }
                    const owner = await msw.get_wallet_owner(event.wallet_owner_uid)
                    enqueueSnackbar(`"${owner.name}" voted for rejecting a transaction`, {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                      action: getTransactionLink(event.transaction_uid)
                    })
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'WalletOwnerAddition': {
                    const owner = await msw.get_wallet_owner(event.wallet_owner_uid)
                    enqueueSnackbar(`A new wallet owner has been added : "${owner.name}"`, {
                      variant: 'success',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshWalletOwners(msw))
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'WalletOwnerRemoval': {
                    const owner = await msw.get_wallet_owner(event.wallet_owner_uid)
                    enqueueSnackbar(`A wallet owner has been removed : "${owner.name}"`, {
                      variant: 'warning',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(refreshWalletOwners(msw))
                    dispatch(refreshLatestTransactions(msw))
                  } break

                  case 'WalletSettingsSafeNameChanged':
                    enqueueSnackbar(`The safe name has been changed to "${event.safe_name}"`, {
                      variant: 'info',
                      autoHideDuration: 10000,
                      anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
                    })
                    dispatch(dispatchers.setSafeName(event.safe_name))
                    break
                }
              })
              )
            })
        })

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
            dispatch(dispatchers.setConnectedWalletOwner(connectedWalletOwner))
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
            value: `${(balance * Math.random() / 1000000000000000000).toFixed(2)} USD` // todo
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
    dispatch(refreshMultisigBalances(msw, safeAddressUrl))
    dispatch(refreshWalletOwners(msw))
    dispatch(refreshContractVersion(msw))
    dispatch(refreshSafeName(msw))
    dispatch(refreshWalletOwnersRequired(msw))
    dispatch(refreshLatestTransactions(msw))
    dispatch(refreshConnectedWalletOwner(msw, walletConnected))
    dispatch(refreshLatestEvents(msw, enqueueSnackbar))
  }, [safeAddressUrl])

  useEffect(() => {
    // Check for new events regularly
    setInterval(() => {
      dispatch(refreshLatestEvents(msw, enqueueSnackbar))
    }, 1000 * 2)
  }, [])

  return (
    <>
      <HeaderBar />
      <div className={styles.root}>
        <SafeHeader />
        <SafeTabChoser />
      </div>
    </>
  )
}

export default withSnackbar(Safe)
