import { withStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OwnerForm from './screens/OwnerForm'
import ReviewAddOwner from './screens/Review'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import Modal from '@components/Modal'

const styles = () => ({
  biggerModalWindow: {
    width: '775px',
    minHeight: '500px',
    height: 'auto'
  }
})

export const sendAddOwner = (values, safeAddress) => {
  const { ownerName, ownerAddress } = values
  const msw = getMultiSigWalletAPI(safeAddress)
  msw.add_wallet_owner(ownerAddress, ownerName)
}

const AddOwner = ({ classes, isOpen, onClose }) => {
  const [activeScreen, setActiveScreen] = useState('selectOwner')
  const [values, setValues] = useState({})
  const dispatch = useDispatch()
  const safeAddress = useSelector((state) => state.safeAddress)

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

  const onAddOwner = async () => {
    onClose()
    sendAddOwner(values, safeAddress, dispatch)
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
        {activeScreen === 'reviewAddOwner' && (
          <ReviewAddOwner onClickBack={() => onClickBack()} onClose={() => onClose()} onSubmit={() => onAddOwner()} values={values} />
        )}
      </>
    </Modal>
  )
}

export default withStyles(styles)(AddOwner)
