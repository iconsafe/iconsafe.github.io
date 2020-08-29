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
import { IncomingTxDescription } from '@components/Safe/Transactions/TransactionDetails/IncomingTxDescription'
import { OutgoingTxDescription } from '@components/Safe/Transactions/TransactionDetails/OutgoingTxDescription'
import OwnersColumn from './OwnersColumn'

const useStyles = makeStyles(styles)

const TransactionDetails = ({ transaction }) => {
  const networkConnected = useSelector((state) => state.networkConnected)
  const classes = useStyles()
  const [transactionStepUsed, setTransactionStepUsed] = useState(null)
  const [transactionStepPrice, setTransactionStepPrice] = useState(null)

  const isIncomingTx = transaction.type === 'INCOMING'
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
        <Row>
          <Col layout='column' xs={6}>
            <Block className={cn(classes.txDataContainer, (isIncomingTx) && classes.incomingTxBlock)}>
              <div style={{ display: 'flex' }}>
                <Bold className={classes.txHash}>Hash:</Bold>
                {
                  transaction.created_txhash
                    ? (
                      <ICONHashInfo
                        hash={transaction.created_txhash}
                        shortenHash={4}
                        showCopyBtn
                        showTrackerBtn
                        network={networkConnected}
                      />
                    ) : 'n/a'
                }
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
              <OutgoingTx isOutgoingTx={isOutgoingTx} tx={transaction} />
            </Block>
            <Hairline />
            {isIncomingTx && <IncomingTxDescription tx={transaction} />}
            {isOutgoingTx && <OutgoingTxDescription tx={transaction} />}
          </Col>
          {isOutgoingTx && (
            <OwnersColumn tx={transaction} />
          )}
        </Row>
      </Block>
    </>
  )
}

export default TransactionDetails
