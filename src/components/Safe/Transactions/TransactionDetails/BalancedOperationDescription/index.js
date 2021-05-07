import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'

import Block from '@components/core/Block'
import Bold from '@components/core/Bold'
import Span from '@components/core/Span'
import { styles } from './styles'
import { makeStyles } from '@material-ui/core/styles'
import { displayUnit } from '@src/utils/icon'

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
        console.log(tx)
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

      case 'stake':
        return (
          <div className={classes.content}>
            Change <Bold>stake amount </Bold> to
            <Span className={classes.cyanText}> {displayUnit(getTxParam(tx, '_value').value, 18)} BALN</Span>
          </div>
        )

      default:
        return `Unsupported operation ${tx.method_name} !`
    }
  }

  return (
    <Block className={classes.container}>
      {content}
    </Block>
  )
}

export default BalancedOperationDescription
