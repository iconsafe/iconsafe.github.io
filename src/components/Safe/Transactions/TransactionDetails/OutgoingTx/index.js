import React from 'react'
import Bold from '@components/core/Bold'
import Paragraph from '@components/core/Paragraph'
import { TransactionFailReason } from '@components/Safe/Transactions/TransactionDetails/OutgoingTxDescription/TransactionFailReason'
import { convertTsToDateString } from '@src/utils/icon'

export const OutgoingTx = ({ tx, isOutgoingTx }) => {
  if (!tx) {
    return null
  }

  const hasFailed = tx.status === 'FAILED'

  return isOutgoingTx ? (
    <>
      <Paragraph noMargin>
        <Bold>Created: </Bold>
        {convertTsToDateString(tx.created_timestamp)}
      </Paragraph>
      {tx.executed_timestamp ? (
        <Paragraph noMargin>
          <Bold>Executed: </Bold>
          {convertTsToDateString(tx.executed_timestamp)}
        </Paragraph>
      ) : null}

      {hasFailed && <TransactionFailReason tx={tx} />}

    </>
  ) : null
}
