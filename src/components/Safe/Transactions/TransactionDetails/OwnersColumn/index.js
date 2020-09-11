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
import { makeStyles } from '@material-ui/core/styles'
import { getSafeAddressFromUrl } from '@src/utils/route'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import Button from '@components/core/Button'
import { styles } from './style'
import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles(styles)

const OwnersColumn = ({ tx }) => {
  const classes = useStyles()
  const globalTreshold = useSelector((state) => state.walletOwnersRequired)

  const getThreshold = (tx) => {
    if (tx.status === 'FAILED') return Math.max(tx.confirmations.length, tx.rejections.length)
    if (tx.status === 'EXECUTED') return tx.confirmations.length
    if (tx.status === 'REJECTED') return tx.rejections.length
    return globalTreshold
  }

  const threshold = getThreshold(tx)
  const thresholdConfirmationsReached = tx.confirmations.length >= threshold
  const thresholdRejectionsReached = tx.rejections.length >= threshold
  const thresholdReached = thresholdConfirmationsReached || thresholdRejectionsReached
  const owners = useSelector((state) => state.walletOwners)
  const granted = useSelector((state) => state.granted)
  const unconfirmed = owners
    .filter(owner => !tx.confirmations.includes(owner.uid))
    .filter(owner => !tx.rejections.includes(owner.uid))
    .map(owner => owner.uid)
  const msw = getMultiSigWalletAPI(getSafeAddressFromUrl())

  const getConfirmedThread = () => {
    return (
      <>
        <Block className={cn(classes.ownerListTitle, classes.ownerListTitleGreen)}>
          <div className={classes.circleState}>
            <Img
              alt=''
              src={thresholdConfirmationsReached || tx.status === 'EXECUTED' ? CheckLargeFilledGreenCircle : ConfirmLargeGreenCircle}
            />
          </div>
          {tx.status === 'EXECUTED'
            ? `Confirmed [${tx.confirmations.length}/${tx.confirmations.length}]`
            : `Confirmed [${tx.confirmations.length}/${threshold}]`}
        </Block>
        <OwnersList
          tx={tx}
          arrayOwners={tx.confirmations}
          threshold={threshold}
          thresholdReached={thresholdReached}
        />
      </>
    )
  }

  const getRejectedThread = () => {
    return (
      <>
        <Block className={cn(classes.ownerListTitle, classes.ownerListTitleRed)}>
          <div className={cn(classes.verticalLine, tx.status === 'EXECUTED' ? classes.verticalLineGreen : classes.verticalLinePending)} />
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
        <OwnersList
          tx={tx}
          arrayOwners={tx.rejections}
          isCancelTx
          threshold={threshold}
          thresholdReached={thresholdReached}
        />
      </>
    )
  }

  const getWaitingThread = () => {
    return (
      <>
        <Block className={cn(classes.ownerListTitle)}>
          <div className={cn(classes.verticalLine, tx.status === 'EXECUTED' ? classes.verticalLineGreen : classes.verticalLinePending)} />
          <div className={classes.circleState}>
            <Img
              alt=''
              src={ConfirmLargeGreyCircle}
            />
          </div>
          {`Unconfirmed [${unconfirmed.length}]`}
        </Block>
        <OwnersList
          tx={tx}
          isUnconfirmed
          arrayOwners={unconfirmed}
          threshold={threshold}
          thresholdReached={thresholdReached}
        />
      </>
    )
  }

  const showCancelBtn = granted && tx.status === 'WAITING' && (tx.confirmations.length === 0 && tx.rejections.length === 0)
  const onTxCancel = () => { msw.cancel_transaction(tx.uid) }

  const cancelButton = () => {
    return (
      <Button
        className={cn(classes.button, classes.lastButton)}
        style={{ color: 'red', float: 'right', position: 'absolute', right: '0', bottom: '0', margin: '0 15px 15px 0' }}
        color='primary'
        onClick={onTxCancel}
      >
        <DeleteIcon />
        Cancel transaction
      </Button>
    )
  }

  return (
    <Col className={classes.rightCol} layout='block' xs={6}>

      {/* Set the confirmed at the bottom */}
      {getConfirmedThread()}
      {getRejectedThread()}

      {/* Waiting Thread */}
      {!thresholdReached &&
        getWaitingThread()}

      {/* Status Thread */}
      <Block
        className={cn(
          classes.ownerListTitle,
          tx.status === 'EXECUTED' && classes.ownerListTitleGreen,
          tx.status === 'REJECTED' && classes.ownerListTitleRed,
          tx.status === 'FAILED' && classes.ownerListTitleRed
        )}
      >
        <div
          className={cn(
            classes.verticalLine,
            tx.status === 'EXECUTED' && classes.verticalLineGreen,
            tx.status === 'FAILED' && classes.verticalLineRed,
            tx.status === 'REJECTED' && classes.verticalLineRed
          )}
        />
        <div className={classes.circleState}>
          {tx.status === 'WAITING' && <Img alt='Confirm / Execute tx' src={ConfirmLargeGreyCircle} />}
          {tx.status === 'FAILED' && <Img alt='Failed tx' src={ErrorLargeFilledRedCircle} />}
          {tx.status === 'CANCELLED' && <Img alt='Failed tx' src={ErrorLargeFilledRedCircle} />}
          {!(tx.status === 'FAILED') && thresholdConfirmationsReached && <Img alt='TX Executed icon' src={CheckLargeFilledGreenCircle} />}
          {!(tx.status === 'FAILED') && thresholdRejectionsReached && <Img alt='TX Executed icon' src={CheckLargeFilledRedCircle} />}
        </div>

        {tx.status === 'WAITING' && 'Waiting'}
        {tx.status === 'FAILED' && 'Failed'}
        {tx.status === 'CANCELLED' && 'Cancelled'}
        {!(tx.status === 'FAILED') && thresholdConfirmationsReached && 'Executed'}
        {!(tx.status === 'FAILED') && thresholdRejectionsReached && 'Rejected'}
        {showCancelBtn && cancelButton()}
      </Block>

    </Col>
  )
}

export default OwnersColumn
