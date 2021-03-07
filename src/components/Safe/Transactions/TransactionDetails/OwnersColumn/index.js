import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import OwnersList from './OwnersList'
import CheckLargeFilledGreenCircle from './assets/check-large-filled-green.svg'
import CheckLargeFilledRedCircle from './assets/check-large-filled-red.svg'
import ErrorLargeFilledRedCircle from './assets/error-large-filled-red.svg'
import ConfirmLargeGreenCircle from './assets/confirm-large-green.svg'
import ConfirmLargeOrangeCircle from './assets/confirm-large-orange.svg'
import ConfirmLargeGreyCircle from './assets/confirm-large-grey.svg'
import ConfirmLargeRedCircle from './assets/confirm-large-red.svg'
import Block from '@components/core/Block'
import Col from '@components/core/Col'
import Img from '@components/core/Img'
import { makeStyles } from '@material-ui/core/styles'
import { getSafeAddressFromUrl } from '@src/utils/route'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import Button from '@components/core/Button'
import { styles } from './style'
import DeleteIcon from '@material-ui/icons/Delete'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import CancelIcon from '@material-ui/icons/Cancel'
import Span from '@components/core/Span'

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
  const connectedWalletOwner = useSelector((state) => state.connectedWalletOwner)

  const getConfirmedThread = () => {
    return (
      <>
        <Block className={cn(classes.ownerListTitle, classes.ownerListTitleCyan)}>
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
          <div className={cn(classes.verticalLine, tx.status === 'EXECUTED' ? classes.verticalLineCyan : classes.verticalLinePending)} />
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
          <div className={cn(classes.verticalLine, tx.status === 'EXECUTED' ? classes.verticalLineCyan : classes.verticalLinePending)} />
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

  const onTxConfirm = () => { msw.confirm_transaction(tx.uid) }
  const onTxReject = () => { msw.reject_transaction(tx.uid) }
  const onTxRevoke = () => { msw.revoke_transaction(tx.uid) }
  const onTxCancel = () => { msw.cancel_transaction(tx.uid) }
  const showConfirmBtn = tx.status === 'WAITING' && unconfirmed.includes(connectedWalletOwner?.uid)
  const showRejectBtn = tx.status === 'WAITING' && unconfirmed.includes(connectedWalletOwner?.uid)
  const showRevokeBtn = tx.status === 'WAITING' && (tx.confirmations.includes(connectedWalletOwner?.uid) || tx.rejections.includes(connectedWalletOwner?.uid))
  const showCancelBtn = granted && tx.status === 'WAITING' && (tx.confirmations.length === 0 && tx.rejections.length === 0)

  const confirmButton = () => {
    return (
      <>
        {showConfirmBtn && (
          <Button
            className={classes.button}
            color='primary'
            onClick={onTxConfirm}
            size='small'
            variant='contained'
          >
            <ThumbUpIcon />
            <Span style={{ marginLeft: '10px' }}>Confirm</Span>
          </Button>
        )}
      </>
    )
  }

  const rejectButton = () => {
    return (
      showRejectBtn && (
        <Button
          size='small'
          className={cn(classes.button)}
          color='secondary'
          onClick={onTxReject}
          variant='contained'
        >
          <ThumbDownIcon />
          <Span style={{ marginLeft: '10px' }}>Reject</Span>
        </Button>
      )
    )
  }

  const revokeButton = () => {
    return (
      showRevokeBtn && (
        <Button
          size='small'
          className={cn(classes.button)}
          color='primary'
          onClick={onTxRevoke}
          variant='contained'
        >
          <CancelIcon />
          <Span style={{ marginLeft: '10px' }}>Revoke vote</Span>
        </Button>
      )
    )
  }

  const cancelButton = () => {
    return (
      showCancelBtn &&
      <Button
        className={cn(classes.button)}
        style={{ color: 'red', marginLeft: '100px', position: 'relative', right: '0' }}
        color='primary'
        onClick={onTxCancel}
      >
        <DeleteIcon />
        Cancel transaction
      </Button>
    )
  }

  return (
    <Col className={classes.rightCol} layout='block'>

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
          classes.ownerListTitleResult,
          tx.status === 'EXECUTED' && classes.ownerListTitleConfirmed,
          tx.status === 'REJECTED' && classes.ownerListTitleRed,
          tx.status === 'WAITING' && classes.ownerListTitleWaiting,
          tx.status === 'FAILED' && classes.ownerListTitleRed
        )}
      >
        <div
          className={cn(
            classes.verticalLine,
            tx.status === 'EXECUTED' && classes.verticalLineCyan,
            tx.status === 'FAILED' && classes.verticalLineRed,
            tx.status === 'REJECTED' && classes.verticalLineRed
          )}
        />
        <div className={classes.circleState}>
          {tx.status === 'WAITING' && <Img alt='Confirm / Execute tx' src={ConfirmLargeOrangeCircle} />}
          {tx.status === 'FAILED' && <Img alt='Failed tx' src={ErrorLargeFilledRedCircle} />}
          {tx.status === 'CANCELLED' && <Img alt='Failed tx' src={ErrorLargeFilledRedCircle} />}
          {!(tx.status === 'FAILED') && thresholdConfirmationsReached && <Img alt='TX Executed icon' src={CheckLargeFilledGreenCircle} />}
          {!(tx.status === 'FAILED') && thresholdRejectionsReached && <Img alt='TX Executed icon' src={CheckLargeFilledRedCircle} />}
        </div>

        {tx.status === 'WAITING' && 'Pending'}
        {tx.status === 'FAILED' && 'Failed'}
        {tx.status === 'CANCELLED' && 'Cancelled'}
        {!(tx.status === 'FAILED') && thresholdConfirmationsReached && 'Executed'}
        {!(tx.status === 'FAILED') && thresholdRejectionsReached && 'Rejected'}

      </Block>

      {connectedWalletOwner &&
        <div className={classes.actionButtons}>
          {rejectButton()}
          {confirmButton()}
          {revokeButton()}
          {cancelButton()}
        </div>}

    </Col>
  )
}

export default OwnersColumn
