import React, { useState, useEffect } from 'react'
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
import { getSafeAddress } from '@src/utils/route'

const Transactions = () => {
  const [transactions, setTransactions] = useState(null)
  const safeAddress = getSafeAddress()
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
              txhash: transaction.txhash,
              source: transaction.source,
              // There is always always one token per incoming transaction
              tokens: [{
                symbol: symbol,
                amount: transaction.amount,
                decimals: decimals,
                source: transaction.source
              }],
              createdDate: transaction.created_timestamp,
              status: state
            }
          })

        case 'OUTGOING': {
          const tokens = {}
          const cache = {}

          transaction.sub_transactions.forEach(subtx => {
            // Sum amounts for ICX
            if (!tokens[ICX_TOKEN_SYMBOL]) {
              tokens[ICX_TOKEN_SYMBOL] = {
                amount: IconConverter.toBigNumber(0),
                decimals: ICX_TOKEN_DECIMALS,
                destination: subtx.destination
              }
            }
            tokens[ICX_TOKEN_SYMBOL].amount = tokens[ICX_TOKEN_SYMBOL].amount.plus(subtx.amount)
          })

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

            // Sum amounts for all tokens
            transaction.sub_transactions.forEach(subtx => {
              if (cache[subtx.destination]) {
                const { symbol, decimals } = cache[subtx.destination]

                const arg = subtx.params.filter(tx => tx.name === '_value')[0].value
                const to = subtx.params.filter(tx => tx.name === '_to')[0].value
                const value = IconConverter.toBigNumber(arg)

                if (!tokens[symbol]) {
                  tokens[symbol] = {
                    amount: IconConverter.toBigNumber(0),
                    decimals: decimals,
                    destination: to
                  }
                }
                tokens[symbol].amount = tokens[symbol].amount.plus(value)
              }
            })

            // Flatten the tokens dict
            return Promise.all(Object.entries(tokens).filter(entry => {
              return !(entry[1].amount.isEqualTo(0))
            }).map(async ([symbol, v]) => {
              return { symbol: symbol, amount: v.amount, decimals: v.decimals, destination: v.destination }
            })).then(tokensArray => {
              return {
                uid: transaction.uid,
                type: transaction.type,
                txhash: transaction.txhash,
                tokens: tokensArray,
                subTx: transaction.sub_transactions,
                confirmations: transaction.confirmations,
                rejections: transaction.rejections,
                createdDate: transaction.created_timestamp,
                executedDate: transaction.executed_timestamp,
                status: getTransactionState(transaction)
              }
            })
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
