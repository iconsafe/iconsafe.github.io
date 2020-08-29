import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ICONHashInfo } from '@components/ICON/'
import { getSafeAddress } from '@src/utils/route'
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
  const classes = useStyles()
  const [imgCircle, setImgCircle] = useState(ConfirmSmallGreyCircle)
  const [owner, setOwner] = useState(null)
  const msw = getMultiSigWalletAPI(getSafeAddress())

  console.log('isCancelTx = ', isCancelTx)

  const showConfirmBtn = true
  const showExecuteBtn = false
  const showRejectBtn = true
  const showExecuteRejectBtn = false

  console.log('UID = ', ownerUid, 'CONFIRMED = ', confirmed)

  const onTxConfirm = () => {
    console.log('onTxConfirm')
  }
  const onTxExecute = () => {
    console.log('onTxExecute')
  }
  const onTxReject = () => {
    console.log('onTxReject')
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
      return classes.verticalLineCancel
    }
    if (isUnconfirmed) {
      return classes.verticalLinePending
    }
    return classes.verticalLineDone
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
        {showExecuteBtn && (
          <Button
            className={classes.button}
            color='primary'
            onClick={onTxExecute}
            variant='contained'
          >
            Execute
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
        {showExecuteRejectBtn && (
          <Button
            className={cn(classes.button, classes.lastButton)}
            color='secondary'
            onClick={onTxReject}
            variant='contained'
          >
            Execute
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
          showEtherscanBtn
          network={networkConnected}
        />}

      <Block className={classes.spacer} />

      {owner && owner.address === walletConnected && <Block>{isCancelTx ? rejectButton() : confirmButton()}</Block>}
    </Block>
  )
}

export default OwnerComponent
