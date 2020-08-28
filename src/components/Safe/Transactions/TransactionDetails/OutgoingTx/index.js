import React from 'react'
import Bold from '@components/core/Bold'
import Paragraph from '@components/core/Paragraph'
import { convertTsToDateString } from '@src/utils/icon'

export const OutgoingTx = ({ tx, isOutgoingTx }) => {
  if (!tx) {
    return null
  }

  return isOutgoingTx ? (
    <>
      <Paragraph noMargin>
        <Bold>Created: </Bold>
        {convertTsToDateString(tx.createdDate)}
      </Paragraph>
      {tx.executedDate ? (
        <Paragraph noMargin>
          <Bold>Executed: </Bold>
          {convertTsToDateString(tx.executedDate)}
        </Paragraph>
      ) : <></>}
    </>
  ) : null
}
