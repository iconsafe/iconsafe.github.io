/* eslint-disable react/prop-types */
import { makeStyles } from '@material-ui/core/styles'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { styles } from './style'
import Block from '@components/core/Block'
import Row from '@components/core/Row'
import Col from '@components/core/Col'
import Bold from '@components/core/Bold'
import { displayBigInt } from '@src/utils/icon'
import { ICONHashInfo } from '@components/ICON/'
import Paragraph from '@components/core/Paragraph'
import Hairline from '@components/core/Hairline'
import cn from 'classnames'
import { getAnciliaAPI } from '@src/utils/ancilia'
import { IncomingTx } from './IncomingTx'
import { OutgoingTx } from './OutgoingTx'
import { ClaimIScoreTx } from './ClaimIScoreTx'
import { IncomingTxDescription } from './IncomingTxDescription'
import { OutgoingTxDescription } from './OutgoingTxDescription'
import { ClaimIScoreTxDescription } from './ClaimIScoreTxDescription'
import OwnersColumn from './OwnersColumn'
import CopyBtn from '@components/core/CopyBtn'
import { useLocation } from 'react-router-dom'

const useStyles = makeStyles(styles)

const TransactionDetails = ({ transaction }) => {
  const networkConnected = useSelector((state) => state.networkConnected)
  const classes = useStyles()
  const [transactionStepUsed, setTransactionStepUsed] = useState(null)
  const [transactionStepPrice, setTransactionStepPrice] = useState(null)
  const location = useLocation()

  const isIncomingTx = transaction.type === 'INCOMING'
  const isClaimIScoreTx = transaction.type === 'CLAIM_ISCORE'
  const isOutgoingTx = transaction.type === 'OUTGOING'
  const ancilia = getAnciliaAPI()

  useEffect(() => {
    transaction.created_txhash && ancilia.txResult(transaction.created_txhash).then(result => {
      setTransactionStepUsed(result.stepUsed)
      setTransactionStepPrice(result.stepPrice)
    })
  }, [JSON.stringify(transaction)])

  return (
    <>
      <Block className={classes.expandedTxBlock}>
        <div className={classes.colLeft}>
          <Block className={cn(classes.txDataContainer, (isIncomingTx) && classes.incomingTxBlock)}>
            <div style={{ display: 'flex' }}>
              <Bold className={classes.txHash}>Tx Permalink:</Bold>
              <CopyBtn content={`${window.location.origin}/#${location.pathname}?transaction=${transaction.uid}`} />
            </div>
            <div style={{ display: 'flex' }}>
              <Bold className={classes.txHash}>Hash:</Bold>
              {transaction.created_txhash
                ? (
                  <ICONHashInfo
                    hash={transaction.created_txhash}
                    shortenHash={4}
                    showCopyBtn
                    showTrackerBtn
                    network={networkConnected}
                  />) : 'n/a'}
            </div>
            {transaction.created_txhash && transactionStepUsed ? (
              <Paragraph noMargin>
                <Bold>Step Used: </Bold>
                {`${displayBigInt(transactionStepUsed)} steps` || 'n/a'}
              </Paragraph>
            ) : null}
            {transaction.created_txhash && transactionStepPrice ? (
              <Paragraph noMargin>
                <Bold>Step Price: </Bold>
                {`${displayBigInt(transactionStepPrice)}` || 'n/a'}
              </Paragraph>
            ) : null}
            {transaction.created_txhash && transactionStepUsed && transactionStepPrice ? (
              <Paragraph noMargin>
                <Bold>TxFee: </Bold>
                {`${displayBigInt(ancilia.convertDecimalsToUnit(transactionStepUsed.multipliedBy(transactionStepPrice), 18))} ICX` || 'n/a'}
              </Paragraph>
            ) : null}
            <IncomingTx isIncomingTx={isIncomingTx} tx={transaction} />
            <ClaimIScoreTx isClaimIScoreTx={isClaimIScoreTx} tx={transaction} />
            <OutgoingTx isOutgoingTx={isOutgoingTx} tx={transaction} />
          </Block>
          <Hairline />
          {isClaimIScoreTx && <ClaimIScoreTxDescription tx={transaction} />}
          {isIncomingTx && <IncomingTxDescription tx={transaction} />}
          {isOutgoingTx && <OutgoingTxDescription tx={transaction} />}
        </div>
        {isOutgoingTx && (
          <div className={classes.colRight}>
            <OwnersColumn tx={transaction} />
          </div>
        )}

      </Block>

      <Hairline />
    </>
  )
}

export default TransactionDetails
