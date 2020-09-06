import { withStyles } from '@material-ui/core/styles'
import { withSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import OwnerForm from './screens/OwnerForm'
import ReviewReplaceOwner from './screens/Review'
import Modal from '@src/components/Modal'
import { getMultiSigWalletAPI } from '@src/utils/msw'

const styles = () => ({
  biggerModalWindow: {
    width: '775px',
    minHeight: '500px',
    height: 'auto'
  }
})

const ReplaceOwner = ({ classes, closeSnackbar, enqueueSnackbar, isOpen, onClose, ownerAddress, ownerName }) => {
  const [activeScreen, setActiveScreen] = useState('checkOwner')
  const [values, setValues] = useState({})
  const safeAddress = useSelector((state) => state.safeAddress)

  useEffect(
    () => () => {
      setActiveScreen('checkOwner')
      setValues({})
    },
    [isOpen]
  )

  const onClickBack = () => setActiveScreen('checkOwner')

  const ownerSubmitted = (newValues) => {
    const { ownerAddress, ownerName } = newValues
    values.ownerName = ownerName
    values.ownerAddress = ownerAddress
    setValues(values)
    setActiveScreen('reviewReplaceOwner')
  }

  const onReplaceOwner = async () => {
    const msw = getMultiSigWalletAPI(safeAddress)
    msw.get_wallet_owner_uid(ownerAddress).then(uid => {
      msw.replace_wallet_owner(uid, values.ownerAddress, values.ownerName)
    })
    onClose()
  }

  return (
    <Modal
      description='Replace owner from Safe'
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.biggerModalWindow}
      title='Replace owner from Safe'
    >
      <>
        {activeScreen === 'checkOwner' && (
          <OwnerForm onClose={onClose} onSubmit={ownerSubmitted} ownerAddress={ownerAddress} ownerName={ownerName} />
        )}
        {activeScreen === 'reviewReplaceOwner' && (
          <ReviewReplaceOwner
            onClickBack={onClickBack}
            onClose={onClose}
            onSubmit={onReplaceOwner}
            ownerAddress={ownerAddress}
            ownerName={ownerName}
            values={values}
          />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles)(withSnackbar(ReplaceOwner))
