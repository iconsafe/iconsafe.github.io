import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ICONHashInfo } from '@components/ICON/'
import { getSafeAddressFromUrl } from '@src/utils/route'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import orange from '@material-ui/core/colors/orange'
import red from '@material-ui/core/colors/red'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import CancelIcon from '@material-ui/icons/Cancel'

import CancelSmallFilledCircle from './assets/cancel-small-filled.svg'
import ConfirmSmallFilledCircle from './assets/confirm-small-filled.svg'
import ConfirmSmallGreenCircle from './assets/confirm-small-green.svg'
import ConfirmSmallGreyCircle from './assets/confirm-small-grey.svg'
import ConfirmSmallRedCircle from './assets/confirm-small-red.svg'
import { styles } from './style'

import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Img from '@components/core/Img'
import Span from '@components/core/Span'
import Bold from '@components/core/Bold'

const useStyles = makeStyles(styles)

const OwnerComponent = ({
  currentOwnerUid,
  confirmed,
  tx,
  isCancelTx,
  isUnconfirmed,
  thresholdReached
}) => {
  const [currentOwner, setCurrentOwner] = useState(null)
  const networkConnected = useSelector((state) => state.networkConnected)
  const walletOwners = useSelector((state) => state.walletOwners)
  const classes = useStyles()
  const [imgCircle, setImgCircle] = useState(ConfirmSmallGreyCircle)
  const connectedWalletOwner = useSelector((state) => state.connectedWalletOwner)
  const msw = getMultiSigWalletAPI(getSafeAddressFromUrl())
  const unconfirmed = walletOwners
    .filter(owner => !tx.confirmations.includes(owner.uid))
    .filter(owner => !tx.rejections.includes(owner.uid))
    .map(owner => owner.uid)

  const showConfirmBtn = tx.status === 'WAITING' && unconfirmed.includes(connectedWalletOwner?.uid)
  const showRejectBtn = tx.status === 'WAITING' && unconfirmed.includes(connectedWalletOwner?.uid)
  const showRevokeBtn = tx.status === 'WAITING' && (tx.confirmations.includes(connectedWalletOwner?.uid) || tx.rejections.includes(connectedWalletOwner?.uid))

  const onTxConfirm = () => { msw.confirm_transaction(tx.uid) }
  const onTxReject = () => { msw.reject_transaction(tx.uid) }
  const onTxRevoke = () => { msw.revoke_transaction(tx.uid) }

  useEffect(() => {
    if (!walletOwners.map(owner => owner.uid).includes(currentOwnerUid)) {
      msw.get_wallet_owner(currentOwnerUid).then(owner => {
        setCurrentOwner(owner)
      })
    } else {
      const cachedOwner = walletOwners.filter(owner => { return owner.uid === currentOwnerUid })[0]
      setCurrentOwner(cachedOwner)
    }
  }, [currentOwnerUid, connectedWalletOwner])

  React.useMemo(() => {
    if (isUnconfirmed) {
      setImgCircle(ConfirmSmallGreyCircle)
      return
    }
    if (confirmed) {
      setImgCircle(isCancelTx ? CancelSmallFilledCircle : ConfirmSmallFilledCircle)
      return
    }
    if (thresholdReached) {
      setImgCircle(isCancelTx ? ConfirmSmallRedCircle : ConfirmSmallGreenCircle)
      return
    }
    setImgCircle(ConfirmSmallGreyCircle)
  }, [confirmed, thresholdReached, isCancelTx])

  const getTimelineLine = () => {
    if (isCancelTx) {
      return classes.verticalLineRed
    }
    if (isUnconfirmed) {
      return classes.verticalLinePending
    }
    return classes.verticalLineGreen
  }

  const confirmButton = () => {
    return (
      <>
        {showConfirmBtn && (
          <Button
            className={classes.button}
            color='primary'
            onClick={onTxConfirm}
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
      <>
        {showRejectBtn && (
          <Button
            className={cn(classes.button, classes.lastButton)}
            color='secondary'
            onClick={onTxReject}
            variant='contained'
          >
            <ThumbDownIcon />
            <Span style={{ marginLeft: '10px' }}>Reject</Span>
          </Button>
        )}
      </>
    )
  }

  const revokeButton = () => {
    return (
      <>
        {showRevokeBtn && (
          <Button
            size='small'
            className={cn(classes.button, classes.lastButton)}
            color='primary'
            onClick={onTxRevoke}
            variant='contained'
          >
            <CancelIcon />
            <Span style={{ marginLeft: '10px' }}>Revoke vote</Span>
          </Button>
        )}
      </>
    )
  }

  const ownerName = () => {
    return (
      <>
        {currentOwner.name}
        {(currentOwner.address === connectedWalletOwner?.address) &&
          <Bold> (You)</Bold>}
      </>
    )
  }

  return (
    <Block className={classes.container}>
      <div
        className={cn(
          classes.verticalLine,
          (confirmed || thresholdReached) &&
          getTimelineLine()
        )}
      />
      <div className={classes.circleState}>
        <Img alt='' src={imgCircle} />
      </div>

      {currentOwner &&
        <ICONHashInfo
          hash={currentOwner.address}
          name={ownerName()}
          shortenHash={4}
          showIdenticon
          showCopyBtn
          showTrackerBtn
          network={networkConnected}
        />}

      {currentOwner && connectedWalletOwner && currentOwner.address === connectedWalletOwner.address &&
        <Block className={classes.spacer}>
          {rejectButton()}
          {confirmButton()}
          {revokeButton()}
        </Block>}
    </Block>
  )
}

export default OwnerComponent
