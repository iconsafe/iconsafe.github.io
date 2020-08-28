import React, { useEffect, useState } from 'react'

import Block from '@src/components/core/Block'
import Bold from '@src/components/core/Bold'
import Box from '@material-ui/core/Box'
import { getAnciliaAPI } from '@src/utils/ancilia'

export const TransactionFailReason = ({ tx }) => {
  const [reason, setReason] = useState('Loading...')

  useEffect(() => {
    const getReasonFromTxhash = (txHash) => {
      const ancilia = getAnciliaAPI()
      return ancilia.txResult(txHash).then(result => {
        const eventLog = ancilia.extractEventLog(result.eventLogs, 'TransactionExecutionFailure(int,str)')
        return eventLog.data[0]
      })
    }

    getReasonFromTxhash(tx.txhash).then(reason => {
      setReason(reason)
    })
  }, [tx.txhash])

  return (
    <Block>
      <Bold>Fail reason:</Bold>
      <Box fontFamily='Monospace' color='#fb0000'>{reason}</Box>
    </Block>
  )
}
