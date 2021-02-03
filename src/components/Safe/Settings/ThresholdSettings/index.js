import { withStyles } from '@material-ui/core/styles'
// import { withSnackbar } from 'notistack'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ChangeThreshold from './ChangeThreshold'
import { styles } from './style'

import Modal from '@components/Modal'
import Block from '@components/core/Block'
import Bold from '@components/core/Bold'
import Button from '@components/core/Button'
import Heading from '@components/core/Heading'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'
import { getMultiSigWalletAPI } from '@src/utils/msw'

const ThresholdSettings = ({ classes }) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const dispatch = useDispatch()
  const threshold = useSelector((state) => state.walletOwnersRequired)
  const safeAddress = useSelector((state) => state.safeAddress)
  const owners = useSelector((state) => state.walletOwners)
  const granted = useSelector((state) => state.granted)
  const msw = getMultiSigWalletAPI(safeAddress)

  const toggleModal = () => {
    setModalOpen((prevOpen) => !prevOpen)
  }

  const onChangeThreshold = async (newThreshold) => {
    msw.set_wallet_owners_required(newThreshold)
  }

  return (
    <>
      <Block className={classes.container}>
        <Heading tag='h2'>Required confirmations</Heading>
        <Paragraph>Any transaction requires the confirmation of:</Paragraph>
        <Paragraph className={classes.ownersText} size='lg'>
          <Bold>{threshold}</Bold> out of <Bold>{owners.length}</Bold> owners
        </Paragraph>
        {owners.length > 1 && granted && (
          <Row className={classes.buttonRow}>
            <Button
              className={classes.modifyBtn}
              color='primary'
              minWidth={120}
              onClick={toggleModal}
              variant='contained'
            >
              Modify
            </Button>
          </Row>
        )}
      </Block>

      <Modal
        description='Change Required Confirmations Form'
        handleClose={toggleModal}
        open={isModalOpen}
        title='Change Required Confirmations'
      >
        <ChangeThreshold
          onChangeThreshold={onChangeThreshold}
          onClose={toggleModal}
          owners={owners}
          threshold={threshold}
        />
      </Modal>
    </>
  )
}

export default withStyles(styles)(ThresholdSettings)
