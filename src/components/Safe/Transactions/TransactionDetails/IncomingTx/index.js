import React from 'react'
import Bold from '@components/core/Bold'
import Paragraph from '@components/core/Paragraph'
import { convertTsToDateString } from '@src/utils/icon'

export const IncomingTx = ({ tx, isIncomingTx }) => {
  if (!tx) {
    return null
  }

  return isIncomingTx ? (
    <Paragraph noMargin>
      <Bold>Created: </Bold>
      {convertTsToDateString(tx.createdDate)}
    </Paragraph>
  ) : null
}
