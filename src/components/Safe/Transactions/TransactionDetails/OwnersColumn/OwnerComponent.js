import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import { ICONHashInfo } from '@components/ICON/'

import CancelSmallFilledCircle from './assets/cancel-small-filled.svg'
import ConfirmSmallFilledCircle from './assets/confirm-small-filled.svg'
import ConfirmSmallGreenCircle from './assets/confirm-small-green.svg'
import ConfirmSmallGreyCircle from './assets/confirm-small-grey.svg'
import ConfirmSmallRedCircle from './assets/confirm-small-red.svg'
import PendingSmallYellowCircle from './assets/confirm-small-yellow.svg'
import { styles } from './style'

import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Img from '@components/core/Img'
// import { getNameFromAddressBook } from 'src/logic/addressBook/store/selectors'
// import { OwnersWithoutConfirmations } from './index'

const useStyles = makeStyles(styles)

const OwnerComponent = (props) => {
  const {
    owner,
    pendingAcceptAction,
    pendingRejectAction,
    isCancelTx,
    thresholdReached,
    executor,
    showConfirmBtn,
    onTxConfirm,
    onTxExecute,
    showExecuteBtn,
    showRejectBtn,
    userAddress,
    onTxReject,
    showExecuteRejectBtn,
    confirmed
  } = props
  const nameInAdbk = 'NAMEINADBK' // useSelector((state) => getNameFromAddressBook(state, owner))
  const networkConnected = useSelector((state) => state.networkConnected)
  const classes = useStyles()
  const [imgCircle, setImgCircle] = React.useState(ConfirmSmallGreyCircle)

  React.useMemo(() => {
    if (pendingAcceptAction || pendingRejectAction) {
      setImgCircle(PendingSmallYellowCircle)
      return
    }
    if (confirmed) {
      setImgCircle(isCancelTx ? CancelSmallFilledCircle : ConfirmSmallFilledCircle)
      return
    }
    if (thresholdReached || executor) {
      setImgCircle(isCancelTx ? ConfirmSmallRedCircle : ConfirmSmallGreenCircle)
      return
    }
    setImgCircle(ConfirmSmallGreyCircle)
  }, [confirmed, thresholdReached, executor, isCancelTx, pendingAcceptAction, pendingRejectAction])

  const getTimelineLine = () => {
    if (pendingAcceptAction || pendingRejectAction) {
      return classes.verticalPendingAction
    }
    if (isCancelTx) {
      return classes.verticalLineCancel
    }
    return classes.verticalLineDone
  }

  const confirmButton = () => {
    if (pendingRejectAction) {
      return null
    }
    if (pendingAcceptAction) {
      return <Block className={classes.executor}>Pending</Block>
    }
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
    if (pendingRejectAction) {
      return <Block className={classes.executor}>Pending</Block>
    }
    if (pendingAcceptAction) {
      return null
    }
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
          (confirmed || thresholdReached || executor || pendingAcceptAction || pendingRejectAction) &&
          getTimelineLine()
        )}
      />
      <div className={classes.circleState}>
        <Img alt='' src={imgCircle} />
      </div>
      <ICONHashInfo
        hash={owner}
        name={!nameInAdbk || nameInAdbk === 'UNKNOWN' ? null : nameInAdbk}
        shortenHash={4}
        showIdenticon
        showCopyBtn
        showEtherscanBtn
        network={networkConnected}
      />
      <Block className={classes.spacer} />
      {owner === userAddress && <Block>{isCancelTx ? rejectButton() : confirmButton()}</Block>}
      {owner === executor && <Block className={classes.executor}>Executor</Block>}
    </Block>
  )
}

export default OwnerComponent
