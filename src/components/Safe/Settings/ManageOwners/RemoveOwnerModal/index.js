import { withStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import CheckOwner from './screens/CheckOwner'
import ReviewRemoveOwner from './screens/Review'
import ThresholdForm from './screens/ThresholdForm'
import Modal from '@src/components/Modal'
import { getMultiSigWalletAPI } from '@src/utils/msw'

const styles = () => ({
  biggerModalWindow: {
    width: '775px',
    minHeight: '500px',
    height: 'auto'
  }
})

export const sendRemoveOwner = (
  ownerAddressToRemove,
  msw
) => {
  msw.get_wallet_owner_uid(ownerAddressToRemove).then(ownerUid => {
    msw.remove_wallet_owner(ownerUid)
  })
}

const RemoveOwner = ({ classes, isOpen, onClose, ownerAddress, ownerName }) => {
  const [activeScreen, setActiveScreen] = useState('checkOwner')
  const [values, setValues] = useState({})
  const dispatch = useDispatch()
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)

  useEffect(
    () => () => {
      setActiveScreen('checkOwner')
      setValues({})
    },
    [isOpen]
  )

  const onClickBack = () => {
    if (activeScreen === 'reviewRemoveOwner') {
      setActiveScreen('checkOwner')
    }
  }

  const ownerSubmitted = () => {
    setActiveScreen('reviewRemoveOwner')
  }

  const thresholdSubmitted = (newValues) => {
    values.threshold = newValues.threshold
    setValues(values)
    setActiveScreen('reviewRemoveOwner')
  }

  const onRemoveOwner = () => {
    onClose()
    sendRemoveOwner(
      ownerAddress,
      msw,
      dispatch
    )
  }

  return (
    <Modal
      description='Remove owner from Safe'
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.biggerModalWindow}
      title='Remove owner from Safe'
    >
      <>
        {activeScreen === 'checkOwner' && (
          <CheckOwner onClose={onClose} onSubmit={ownerSubmitted} ownerAddress={ownerAddress} ownerName={ownerName} />
        )}
        {activeScreen === 'selectThreshold' && (
          <ThresholdForm onClickBack={onClickBack} onClose={onClose} onSubmit={thresholdSubmitted} />
        )}
        {activeScreen === 'reviewRemoveOwner' && (
          <ReviewRemoveOwner
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onRemoveOwner}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            values={values}
          />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles)(RemoveOwner)
