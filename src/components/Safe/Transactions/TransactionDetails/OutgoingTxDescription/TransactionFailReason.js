import React, { useEffect, useState } from 'react'

import Block from '@src/components/core/Block'
import Bold from '@src/components/core/Bold'
import Box from '@material-ui/core/Box'
import { getAnciliaAPI } from '@src/utils/ancilia'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './styles'

const useStyles = makeStyles(styles)

export const TransactionFailReason = ({ tx }) => {
  const classes = useStyles()
  const [reason, setReason] = useState('Loading...')

  useEffect(() => {
    const getReasonFromTxhash = (txHash) => {
      const ancilia = getAnciliaAPI()
      return ancilia.txResult(txHash).then(result => {
        const eventLog = ancilia.extractEventLog(result.eventLogs, 'TransactionExecutionFailure(int,str)')
        return eventLog.data[0]
      })
    }

    getReasonFromTxhash(tx.executed_txhash).then(reason => {
      setReason(reason)
    })
  }, [tx.executed_txhash])

  return (
    <Block className={classes.failReasonBlock}>
      <Bold>Fail reason:</Bold>
      <Box className={classes.failReasonBox} fontFamily='Monospace' color='#fb0000'>{reason}</Box>
    </Block>
  )
}
