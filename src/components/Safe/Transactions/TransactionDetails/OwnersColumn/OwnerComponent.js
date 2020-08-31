import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ICONHashInfo } from '@components/ICON/'
import { getSafeAddressFromUrl } from '@src/utils/route'
import { getMultiSigWalletAPI } from '@src/utils/msw'

import CancelSmallFilledCircle from './assets/cancel-small-filled.svg'
import ConfirmSmallFilledCircle from './assets/confirm-small-filled.svg'
import ConfirmSmallGreenCircle from './assets/confirm-small-green.svg'
import ConfirmSmallGreyCircle from './assets/confirm-small-grey.svg'
import ConfirmSmallRedCircle from './assets/confirm-small-red.svg'
import { styles } from './style'

import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Img from '@components/core/Img'
// import { getNameFromAddressBook } from 'src/logic/addressBook/store/selectors'
// import { OwnersWithoutConfirmations } from './index'

const useStyles = makeStyles(styles)

const OwnerComponent = ({
  ownerUid,
  confirmed,
  tx,
  isCancelTx,
  isUnconfirmed,
  threshold,
  thresholdReached
}) => {
  const networkConnected = useSelector((state) => state.networkConnected)
  const walletConnected = useSelector((state) => state.walletConnected)
  const owners = useSelector((state) => state.walletOwners)
  const classes = useStyles()
  const [imgCircle, setImgCircle] = useState(ConfirmSmallGreyCircle)
  const [owner, setOwner] = useState(null)
  const msw = getMultiSigWalletAPI(getSafeAddressFromUrl())
  const unconfirmed = owners
    .filter(owner => !tx.confirmations.includes(owner.uid))
    .filter(owner => !tx.rejections.includes(owner.uid))
    .map(owner => owner.uid)

  const showConfirmBtn = unconfirmed.includes(ownerUid)
  const showRejectBtn = unconfirmed.includes(ownerUid)

  const onTxConfirm = () => {
    msw.confirm_transaction(tx.uid).then(txConfirm => {
      msw.txResult(txConfirm.result).then(result => {
        console.log(result)
      })
    })
  }

  const onTxReject = () => {
    msw.reject_transaction(tx.uid).then(txConfirm => {
      msw.txResult(txConfirm.result).then(result => {
        console.log(result)
      })
    })
  }

  useEffect(() => {
    msw.get_wallet_owner(ownerUid).then(owner => {
      setOwner(owner)
    })
  }, [ownerUid])

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
            Confirm
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
            Reject
          </Button>
        )}
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

      {owner &&
        <ICONHashInfo
          hash={owner.address}
          name={owner.name}
          shortenHash={4}
          showIdenticon
          showCopyBtn
          showTrackerBtn
          network={networkConnected}
        />}

      <Block className={classes.spacer} />

      {owner && owner.address === walletConnected &&
        <Block>
          {rejectButton()}
          {confirmButton()}
        </Block>}
    </Block>
  )
}

export default OwnerComponent
