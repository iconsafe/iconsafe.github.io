import React from 'react'
import Bold from '@components/core/Bold'
import Paragraph from '@components/core/Paragraph'
import { convertTsToDateString } from '@src/utils/icon'

export const ClaimIScoreTx = ({ tx, isClaimIScoreTx }) => {
  if (!tx) {
    return null
  }

  return isClaimIScoreTx ? (
    <Paragraph noMargin>
      <Bold>Created: </Bold>
      {convertTsToDateString(tx.created_timestamp)}
    </Paragraph>
  ) : null
}
