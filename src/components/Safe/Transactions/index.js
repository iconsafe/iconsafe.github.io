import React, { useState, useEffect } from 'react'
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

import { IconConverter } from 'icon-sdk-js'

const Transactions = () => {
  const [transactions, setTransactions] = useState(null)
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)

  useEffect(() => {
    const convertTransactionToDisplay = async (transaction) => {
      console.log('tx before display transformation: ', transaction)
      switch (transaction.type) {
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
          const cache = {}

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
            if (isICONContractAddress(subtx.destination)) {
              cache[subtx.destination] = getSymbolAndDecimalsFromContract(subtx.destination)
            }
          })

          return Promise.allSettled(Object.values(cache)).then((values) => {
            Object.keys(cache).forEach(k => {
              const resolved = values.shift()
              if (resolved.status === 'fulfilled') {
                cache[k] = resolved.value
              } else {
                delete cache[k]
              }
            })

            Object.keys(cache).forEach(address => {
              if (cache[address]) {
                const { symbol, decimals } = cache[address]

                tokens[symbol] = transaction.sub_transactions.filter(subtx => {
                  return subtx.amount.isEqualTo(0)
                }).map(subtx => {
                  const to = subtx.params.filter(tx => tx.name === '_to')[0].value
                  const value = IconConverter.toBigNumber(subtx.params.filter(tx => tx.name === '_value')[0].value)

                  return {
                    amount: value,
                    decimals: decimals,
                    destination: to,
                    address: address
                  }
                })
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

            return {
              uid: transaction.uid,
              type: transaction.type,
              created_txhash: transaction.created_txhash,
              executed_txhash: transaction.executed_txhash,
              tokens: tokensArray,
              safeOperations: safeOperations,
              subTx: transaction.sub_transactions,
              confirmations: transaction.confirmations,
              rejections: transaction.rejections,
              created_timestamp: transaction.created_timestamp,
              executed_timestamp: transaction.executed_timestamp,
              status: getTransactionState(transaction)
            }
          })
        }
      }
    }

    msw.get_all_transactions().then(transactions => {
      const promises = transactions.map(t => convertTransactionToDisplay(t))
      return Promise.allSettled(promises).then(result => {
        result = result.filter(item => item.status === 'fulfilled')
        result = result.map(item => item.value)
        setTransactions(result)
      })
    })
  }, [safeAddress])

  return (
    <div className={styles.root}>
      <Table rows={transactions || []} />
    </div>
  )
}

export default Transactions
