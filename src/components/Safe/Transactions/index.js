import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import styles from './index.module'
import Table from './Table'
import {
  getTokenSymbol,
  ICX_TOKEN_SYMBOL,
  isICONContractAddress,
  ICX_TOKEN_DECIMALS,
  getTokenDecimals
} from '@src/utils/icon'
import { getSymbolAndDecimalsFromContract } from '@src/utils/ancilia'
import { getTransactionState, getMultiSigWalletAPI } from '@src/utils/msw'
import { Loader, LoadingContainer } from '@components/ICON'
import { SCORE_INSTALL_ADDRESS } from '@src/SCORE/Ancilia'
import { BALANCED_SCORES } from '@src/SCORE/Balanced'

import { IconConverter } from 'icon-sdk-js'

export const convertTransactionToDisplay = async (transaction, safeAddress) => {

  const msw = getMultiSigWalletAPI(safeAddress)
  const tokenCache = []

  switch (transaction.type) {
    case 'CLAIM_ISCORE':
      return Promise.all([
        getTokenDecimals(transaction.token),
        getTokenSymbol(transaction.token),
        msw.get_wallet_owner(transaction.claimer_uid)
      ]).then(([decimals, symbol, claimer]) => {
        const state = getTransactionState(transaction)
        return {
          uid: transaction.uid,
          type: transaction.type,
          created_txhash: transaction.created_txhash,
          source: transaction.source,
          // There is always always one token and one transfer per incoming transaction
          tokens: [{
            symbol: symbol,
            decimals: decimals,
            transfers: [{
              amount: transaction.amount,
              source: transaction.source
            }]
          }],
          created_timestamp: transaction.created_timestamp,
          claimer: claimer,
          iscore: transaction.iscore,
          status: state
        }
      })

    case 'INCOMING':
      return Promise.all([
        getTokenDecimals(transaction.token),
        getTokenSymbol(transaction.token)]
      ).then(([decimals, symbol]) => {
        const state = getTransactionState(transaction)

        return {
          uid: transaction.uid,
          type: transaction.type,
          created_txhash: transaction.created_txhash,
          source: transaction.source,
          // There is always always one token and one transfer per incoming transaction
          tokens: [{
            symbol: symbol,
            decimals: decimals,
            transfers: [{
              amount: transaction.amount,
              source: transaction.source
            }]
          }],
          created_timestamp: transaction.created_timestamp,
          status: state
        }
      })

    case 'OUTGOING': {
      const tokens = {}

      tokens[ICX_TOKEN_SYMBOL] = transaction.sub_transactions.filter(subtx => {
        return !subtx.amount.isEqualTo(0)
      }).map(subtx => {
        return {
          amount: subtx.amount,
          decimals: ICX_TOKEN_DECIMALS,
          destination: subtx.destination
        }
      })

      if (tokens[ICX_TOKEN_SYMBOL].length === 0) delete tokens[ICX_TOKEN_SYMBOL]

      // Fill symbol / decimals cache
      transaction.sub_transactions.forEach(subtx => {
        if (!(subtx.destination in tokenCache) && isICONContractAddress(subtx.destination)) {
          tokenCache[subtx.destination] = getSymbolAndDecimalsFromContract(subtx.destination)
        }
      })

      return Promise.allSettled(Object.values(tokenCache))
        .then(values => {
          Object.keys(tokenCache).forEach(k => {
            const resolved = values.shift()
            tokenCache[k] = resolved.value
          })

          Object.keys(tokenCache).forEach(address => {
            if (tokenCache[address]) {
              const { symbol, decimals } = tokenCache[address]

              tokens[symbol] = transaction.sub_transactions
                .filter(subtx => {
                  return subtx.amount.isEqualTo(0)
                })
                .filter(subtx => {
                  // Detect IRC2 transfer
                  return (subtx.method_name === 'transfer' &&
                    subtx.params[0].name === '_to' &&
                    subtx.params[1].name === '_value')
                })
                .map(subtx => {
                  const to = subtx.params.filter(tx => tx.name === '_to')[0].value
                  const value = IconConverter.toBigNumber(subtx.params.filter(tx => tx.name === '_value')[0].value)

                  return {
                    amount: value,
                    decimals: decimals,
                    destination: to,
                    address: address
                  }
                })

              if (tokens[symbol].length === 0) delete tokens[symbol]
            }
          })

          // Flatten the tokens dict
          const tokensArray = Object.entries(tokens).map(([symbol, v]) => {
            return { symbol: symbol, decimals: v[0].decimals, transfers: v }
          })

          // Self operations
          const safeOperations = transaction.sub_transactions.filter(subtx => {
            return subtx.destination === safeAddress
          })

          // IISS operations
          const iissOperations = transaction.sub_transactions.filter(subtx => {
            return subtx.destination === SCORE_INSTALL_ADDRESS
          })

          const balancedOperations = transaction.sub_transactions.filter(subtx => {
            return Object.values(BALANCED_SCORES).includes(subtx.destination)
          })

          return {
            uid: transaction.uid,
            type: transaction.type,
            created_txhash: transaction.created_txhash,
            executed_txhash: transaction.executed_txhash,
            tokens: tokensArray,
            safeOperations: safeOperations,
            iissOperations: iissOperations,
            balancedOperations: balancedOperations,
            subTx: transaction.sub_transactions,
            confirmations: transaction.confirmations,
            rejections: transaction.rejections,
            created_timestamp: transaction.created_timestamp,
            executed_timestamp: transaction.executed_timestamp,
            status: getTransactionState(transaction)
          }
        })
    }

    default:
      throw Error('unsupported transaction type')
  }
}

const Transactions = () => {
  const [transactions, setTransactions] = useState(null)
  const latestTransactions = useSelector((state) => state.latestTransactions)
  const safeAddress = useSelector((state) => state.safeAddress)
  const [queriedTx, setQueriedTx] = useState(null)
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const queriedTxUid = urlParams.get('transaction')

  useEffect(() => {
    latestTransactions && Promise.allSettled(
      latestTransactions.map(t => convertTransactionToDisplay(t, safeAddress)))
      .then(result => {
        result = result.filter(item => item.status === 'fulfilled')
        result = result.map(item => item.value)
        setTransactions(result)
      })
  }, [latestTransactions])

  useEffect(() => {
    if (safeAddress) {
      const msw = getMultiSigWalletAPI(safeAddress)
      if (queriedTxUid) {
        msw.get_transaction(queriedTxUid).then(transaction => {
          convertTransactionToDisplay(transaction, safeAddress).then(result => {
            setQueriedTx(result)
          })
        })
      } else {
        setQueriedTx(null)
      }
    }
  }, [safeAddress, queriedTxUid, latestTransactions])

  return (
    <div className={styles.root}>
      {!transactions &&
        <LoadingContainer>
          <Loader size='md' />
        </LoadingContainer>}
      {transactions &&
        <>
          <Table rows={transactions} queriedTx={queriedTx} />
        </>}
    </div>
  )
}

export default Transactions
