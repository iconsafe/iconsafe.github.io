import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import CopyBtn from '@src/components/core/CopyBtn'
import IconTrackerBtn from '@src/components/core/IconTrackerBtn'
import Identicon from '@src/components/core/Identicon'
import Modal from '@src/components/Modal'
import Field from '@src/components/core/Field'
import GnoForm from '@src/components/core/GnoForm'
import TextField from '@src/components/core/TextField'
import { composeValidators, minMaxLength, required } from '@src/components/core/validator'
import Block from '@src/components/core/Block'
import Button from '@src/components/core/Button'
import Hairline from '@src/components/core/Hairline'
import Paragraph from '@src/components/core/Paragraph'
import Row from '@src/components/core/Row'
import { sm } from '@src/theme/variables'
import { getMultiSigWalletAPI } from '@src/utils/msw'

const EditOwnerComponent = ({
  classes,
  closeSnackbar,
  enqueueSnackbar,
  isOpen,
  onClose,
  ownerAddress,
  selectedOwnerName
}) => {
  const safeAddress = useSelector((state) => state.safeAddress)

  const handleSubmit = (values) => {
    const { ownerName } = values
    const msw = getMultiSigWalletAPI(safeAddress)
    msw.get_wallet_owner_uid(ownerAddress).then(uid => {
      msw.replace_wallet_owner(uid, ownerAddress, ownerName)
    })

    onClose()
  }

  return (
    <Modal
      description='Edit owner from Safe'
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.smallerModalWindow}
      title='Edit owner from Safe'
    >
      <Row align='center' className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight='bolder'>
          Edit owner name
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.container}>
              <Row margin='md'>
                <Field
                  className={classes.addressInput}
                  component={TextField}
                  initialValue={selectedOwnerName}
                  name='ownerName'
                  placeholder='Owner name*'
                  text='Owner name*'
                  type='text'
                  validate={composeValidators(required, minMaxLength(1, 50))}
                />
              </Row>
              <Row>
                <Block className={classes.user} justify='center'>
                  <Identicon address={ownerAddress} diameter={32} />
                  <Paragraph color='disabled' noMargin size='md' style={{ marginLeft: sm, marginRight: sm }}>
                    {ownerAddress}
                  </Paragraph>
                  <CopyBtn content={safeAddress} />
                  <IconTrackerBtn type='address' value={safeAddress} />
                </Block>
              </Row>
            </Block>
            <Hairline />
            <Row align='center' className={classes.buttonRow}>
              <Button minHeight={42} minWidth={140} onClick={onClose}>
                Cancel
              </Button>
              <Button
                color='primary'
                minHeight={42}
                minWidth={140}
                type='submit'
                variant='contained'
              >
                Save
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </Modal>
  )
}

export default withStyles(styles)(EditOwnerComponent)
