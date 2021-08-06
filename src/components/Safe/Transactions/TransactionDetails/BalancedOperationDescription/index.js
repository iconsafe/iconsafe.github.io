import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'

import Block from '@components/core/Block'
import Bold from '@components/core/Bold'
import Span from '@components/core/Span'
import { styles } from './styles'
import { makeStyles } from '@material-ui/core/styles'
import { displayUnit } from '@src/utils/icon'
import { BALANCED_SCORES, BALANCED_TOKENS } from '@src/SCORE/Balanced'

const useStyles = makeStyles(styles)

const BalancedOperationDescription = ({ tx }) => {
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [content, setContent] = useState('Loading...')

  const classes = useStyles()

  useEffect(() => {
    getContent().then(result => {
      setContent(result)
    })
  }, [])

  const getTxParam = (tx, name) => {
    try {
      return tx.params.filter(param => param.name === name)[0]
    } catch {
      return null
    }
  }

  const getContent = async () => {
    switch (tx.method_name) {
      case 'depositAndBorrow':
        return (
          <div className={classes.content}>
            {!tx.amount.isZero() && <><Bold>Deposit</Bold> <Span className={classes.cyanText}> {displayUnit(tx.amount, 18)} ICX</Span> as collateral<br /></>}
            {tx.params && <><Bold>Borrow</Bold> {displayUnit(getTxParam(tx, '_amount').value, 18)} {getTxParam(tx, '_asset').value}</>}
          </div>
        )

      case 'claimRewards':
        return (
          <div className={classes.content}>
            <Bold>Claim</Bold> BALN rewards
          </div>
        )

      case 'returnAsset':
        return (
          <div className={classes.content}>
            <Bold>Pay back</Bold> <Span className={classes.cyanText}> {displayUnit(getTxParam(tx, '_value').value, 18)} bnUSD</Span> of the loan
          </div>
        )

      case 'withdrawCollateral':
        return (
          <div className={classes.content}>
            <Bold>Withdraw</Bold> <Span className={classes.cyanText}> {displayUnit(getTxParam(tx, '_value').value, 18)} ICX</Span> from the collateral.
          </div>
        )

      case 'transfer':
        switch (getTxParam(tx, '_to').value) {
          case BALANCED_SCORES['dex']:
            const output = JSON.parse(Buffer.from(getTxParam(tx, '_data').value.replace('0x', ''), 'hex').toString("utf8"));

            switch (output.method) {
              case "_swap":
                return (
                  <div className={classes.content}>
                    <Bold>Trade <Span className={classes.cyanText}> {displayUnit(getTxParam(tx, '_value').value, 18)} {BALANCED_TOKENS[tx.destination]} </Span></Bold> 
                    on the DEX and receive at least 
                    <Bold> <Span className={classes.cyanText}> {displayUnit(output.params.minimumReceive, 18)} {BALANCED_TOKENS[output.params.toToken]} </Span></Bold>
                  </div>
                )

              default:
                return `Unsupported DEX operation "${output.method}" !`
            }

            
          case BALANCED_SCORES['loans']:
                return (
                  <div className={classes.content}>
                    <Bold>Deposit <Span className={classes.cyanText}> {displayUnit(getTxParam(tx, '_value').value, 18)} {BALANCED_TOKENS[tx.destination]} </Span></Bold> as collateral
                  </div>
                )

          default:
            return `Transfer ${displayUnit(getTxParam(tx, '_value').value, 18)} BALN to "${getTxParam(tx, '_to').value}"`
      }

      case 'stake':
        return (
          <div className={classes.content}>
            Change <Bold>stake amount </Bold> to
            <Span className={classes.cyanText}> {displayUnit(getTxParam(tx, '_value').value, 18)} BALN</Span>
          </div>
        )

      default:
        return `Unsupported operation "${tx.method_name}" !`
    }
  }

  return (
    <Block className={classes.container}>
      {content}
    </Block>
  )
}

export default BalancedOperationDescription
