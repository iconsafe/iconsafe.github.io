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
import Img from '@components/core/Img'
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
    return classes.verticalLineCyan
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
    </Block>
  )
}

export default OwnerComponent
