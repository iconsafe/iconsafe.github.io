import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Block from '@src/components/core/Block'
import Bold from '@src/components/core/Bold'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { getMultiSigWalletAPI, hashToEvents } from '@src/utils/msw'
import { styles } from './styles'

const useStyles = makeStyles(styles)

export const TransactionFailReason = ({ tx }) => {
  const classes = useStyles()
  const [reason, setReason] = useState('Loading...')
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)

  useEffect(() => {
    const getReasonFromTxhash = (txHash) => {
      try {
        return hashToEvents(msw, txHash).then(events => {
          return events.filter(event => event.name === 'TransactionExecutionFailure')[0].error
        })
      } catch {
        return txHash
      }
    }

    getReasonFromTxhash(tx.executed_txhash).then(reason => {
      setReason(reason)
    })
  }, [tx.executed_txhash])

  return (
    <Block className={classes.failReasonBlock}>
      <Bold>Fail reason:</Bold>
      <Box width={0.8} className={classes.failReasonBox} fontFamily='Monospace' color='#fb0000'>
        {reason}
      </Box>
    </Block>
  )
}
