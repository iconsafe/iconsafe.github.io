import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import OwnersList from './OwnersList'
import CheckLargeFilledGreenCircle from './assets/check-large-filled-green.svg'
import CheckLargeFilledRedCircle from './assets/check-large-filled-red.svg'
import ErrorLargeFilledRedCircle from './assets/error-large-filled-red.svg'
import ConfirmLargeGreenCircle from './assets/confirm-large-green.svg'
import ConfirmLargeGreyCircle from './assets/confirm-large-grey.svg'
import ConfirmLargeRedCircle from './assets/confirm-large-red.svg'
import Block from '@src/components/core/Block'
import Col from '@src/components/core/Col'
import Img from '@src/components/core/Img'
import Paragraph from '@src/components/core/Paragraph/index'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './style'

const useStyles = makeStyles(styles)

const OwnersColumn = ({ tx }) => {
  const classes = useStyles()
  const isWaiting = tx.status === 'WAITING'
  const isExecuted = tx.status === 'EXECUTED'
  const isRejected = tx.status === 'REJECTED'
  const isFailed = tx.status === 'FAILED'

  const getThreshold = (tx) => {
    if (isFailed) return Math.max(tx.confirmations.length, tx.rejections.length)
    if (isExecuted) return tx.confirmations.length
    if (isRejected) return tx.rejections.length

    return useSelector((state) => state.walletOwnersRequired)
  }

  const owners = useSelector((state) => state.walletOwners)
  const threshold = getThreshold(tx)
  const connectedWalletOwnerUid = useSelector((state) => state.connectedWalletOwnerUid)
  const thresholdConfirmationsReached = tx.confirmations.length >= threshold
  const thresholdRejectionsReached = tx.rejections.length >= threshold

  return (
    <Col className={classes.rightCol} layout='block' xs={6}>
      <Block
        className={cn(classes.ownerListTitle, classes.ownerListTitleDone)}
      >
        <div className={classes.circleState}>
          <Img
            alt=''
            src={thresholdConfirmationsReached || isExecuted ? CheckLargeFilledGreenCircle : ConfirmLargeGreenCircle}
          />
        </div>
        {isExecuted
          ? `Confirmed [${tx.confirmations.length}/${tx.confirmations.length}]`
          : `Confirmed [${tx.confirmations.length}/${threshold}]`}
      </Block>
      {/* <OwnersList
        executor={tx.executor}
        onTxConfirm={onTxConfirm}
        onTxExecute={onTxExecute}
        ownersUnconfirmed={ownersUnconfirmed}
        ownersWhoConfirmed={ownersWhoConfirmed}
        showConfirmBtn={showConfirmBtn}
        showExecuteBtn={showExecuteBtn}
        thresholdConfirmationsReached={thresholdConfirmationsReached}
        connectedWalletOwnerUid={connectedWalletOwnerUid}
      /> */}

      {/* Cancel TX thread - START */}
      <Block
        className={cn(
          classes.ownerListTitle,
          classes.ownerListTitleCancelDone
        )}
      >
        <div
          className={cn(classes.verticalLine, isExecuted ? classes.verticalLineDone : classes.verticalLinePending)}
        />
        <div className={classes.circleState}>
          <Img
            alt=''
            src={thresholdRejectionsReached ? CheckLargeFilledRedCircle : ConfirmLargeRedCircle}
          />
        </div>
        {thresholdRejectionsReached
          ? `Rejected [${tx.rejections.length}/${tx.rejections.length}]`
          : `Rejected [${tx.rejections.length}/${threshold}]`}
      </Block>

      {/* <OwnersList
        executor={tx.rejections.executor}
        isCancelTx
        onTxReject={onTxReject}
        ownersUnconfirmed={ownersUnconfirmedCancel}
        ownersWhoConfirmed={ownersWhoConfirmedCancel}
        showExecuteRejectBtn={showExecuteRejectBtn}
        showRejectBtn={showRejectBtn}
        thresholdConfirmationsReached={thresholdReached}
        connectedWalletOwnerUid={connectedWalletOwnerUid}
      /> */}
      {/* Cancel TX thread - END */}

      <Block
        className={cn(
          classes.ownerListTitle,
          isExecuted && classes.ownerListTitleDone,
          isFailed && classes.ownerListTitleCancelDone
        )}
      >
        <div
          className={cn(
            classes.verticalLine,
            isExecuted && classes.verticalLineDone,
            isFailed && classes.verticalLineCancel
          )}
        />
        <div className={classes.circleState}>
          {isWaiting && <Img alt='Confirm / Execute tx' src={ConfirmLargeGreyCircle} />}
          {isFailed && <Img alt='Failed tx' src={ErrorLargeFilledRedCircle} />}
          {!isFailed && thresholdConfirmationsReached && <Img alt='TX Executed icon' src={CheckLargeFilledGreenCircle} />}
          {!isFailed && thresholdRejectionsReached && <Img alt='TX Executed icon' src={CheckLargeFilledRedCircle} />}
        </div>

        {isWaiting && 'Waiting'}
        {isFailed && 'Failed'}
        {!isFailed && thresholdConfirmationsReached && 'Executed'}
        {!isFailed && thresholdRejectionsReached && 'Rejected'}
      </Block>

    </Col>
  )
}

export default OwnersColumn
