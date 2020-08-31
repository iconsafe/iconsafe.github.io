import { withStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OwnerForm from './screens/OwnerForm'
import ReviewAddOwner from './screens/Review'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import Modal from '@src/components/Modal'

// import { addOrUpdateAddressBookEntry } from '@src/logic/addressBook/store/actions/addOrUpdateAddressBookEntry'
// import { getGnosisSafeInstanceAt } from '@src/logic/contracts/safeContracts'
// import { TX_NOTIFICATION_TYPES } from '@src/logic/safe/transactions'
// import addSafeOwner from '@src/logic/safe/store/actions/addSafeOwner'
// import createTransaction from '@src/logic/safe/store/actions/createTransaction'
// import { (state) => state.walletOwners, (state) => state.safeAddress } from '@src/logic/safe/store/selectors'
// import { checksumAddress } from '@src/utils/checksumAddress'

const styles = () => ({
  biggerModalWindow: {
    width: '775px',
    minHeight: '500px',
    height: 'auto'
  }
})

export const sendAddOwner = async (values, safeAddress, ownersOld, enqueueSnackbar, closeSnackbar, dispatch) => {
  const { ownerName, ownerAddress } = values
  const msw = getMultiSigWalletAPI(safeAddress)

  msw.add_wallet_owner(ownerAddress, ownerName).then(tx => {
    msw.txResult(tx.result).then(result => {
      console.log(result)
    })
  })
}

const AddOwner = ({ classes, closeSnackbar, enqueueSnackbar, isOpen, onClose }) => {
  const [activeScreen, setActiveScreen] = useState('selectOwner')
  const [values, setValues] = useState({})
  const dispatch = useDispatch()
  const safeAddress = useSelector((state) => state.safeAddress)
  const owners = useSelector((state) => state.walletOwners)

  useEffect(
    () => () => {
      setActiveScreen('selectOwner')
      setValues({})
    },
    [isOpen]
  )

  const onClickBack = () => {
    if (activeScreen === 'reviewAddOwner') {
      setActiveScreen('selectOwner')
    }
  }

  const ownerSubmitted = (newValues) => {
    setValues((stateValues) => ({
      ...stateValues,
      ownerName: newValues.ownerName,
      ownerAddress: newValues.ownerAddress
    }))
    setActiveScreen('reviewAddOwner')
  }

  const thresholdSubmitted = (newValues) => {
    setValues((stateValues) => ({
      ...stateValues,
      threshold: newValues.threshold
    }))
    setActiveScreen('reviewAddOwner')
  }

  const onAddOwner = async () => {
    onClose()

    try {
      await sendAddOwner(values, safeAddress, owners, enqueueSnackbar, closeSnackbar, dispatch)
      // dispatch(addOrUpdateAddressBookEntry(values.ownerAddress, { name: values.ownerName, address: values.ownerAddress }))
    } catch (error) {
      console.error('Error while removing an owner', error)
    }
  }

  return (
    <Modal
      description='Add owner to Safe'
      handleClose={() => onClose()}
      open={isOpen}
      paperClassName={classes.biggerModalWindow}
      title='Add owner to Safe'
    >
      <>
        {activeScreen === 'selectOwner' && <OwnerForm onClose={() => onClose()} onSubmit={(values) => ownerSubmitted(values)} />}
        {/* {activeScreen === 'selectThreshold' && (
          <ThresholdForm onClickBack={() => onClickBack()} onClose={() => onClose()} onSubmit={() => thresholdSubmitted()} />
        )} */}
        {activeScreen === 'reviewAddOwner' && (
          <ReviewAddOwner onClickBack={() => onClickBack()} onClose={() => onClose()} onSubmit={() => onAddOwner()} values={values} />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles)(AddOwner)
