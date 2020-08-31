import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { withSnackbar } from 'notistack'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { styles } from './style'

import CopyBtn from '@src/components/CopyBtn'
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
import { makeAddressBookEntry } from 'src/logic/addressBook/model/addressBook'
import { updateAddressBookEntry } from 'src/logic/addressBook/store/actions/updateAddressBookEntry'
import { getNotificationsFromTxType, showSnackbar } from 'src/logic/notifications'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import editSafeOwner from 'src/logic/safe/store/actions/editSafeOwner'
import { (state) => state.safeAddress } from 'src/logic/safe/store/selectors'
import { sm } from '@src/theme/variables'

export const RENAME_OWNER_INPUT_TEST_ID = 'rename-owner-input'
export const SAVE_OWNER_CHANGES_BTN_TEST_ID = 'save-owner-changes-btn'

const EditOwnerComponent = ({
  classes,
  closeSnackbar,
  enqueueSnackbar,
  isOpen,
  onClose,
  ownerAddress,
  selectedOwnerName,
}) => {
  const dispatch = useDispatch()
  const safeAddress = useSelector((state) => state.safeAddress)
  const handleSubmit = (values) => {
    const { ownerName } = values
    dispatch(editSafeOwner({ safeAddress, ownerAddress, ownerName }))
    dispatch(updateAddressBookEntry(makeAddressBookEntry({ address: ownerAddress, name: ownerName })))
    const notification = getNotificationsFromTxType(TX_NOTIFICATION_TYPES.OWNER_NAME_CHANGE_TX)
    showSnackbar(notification.afterExecution.noMoreConfirmationsNeeded, enqueueSnackbar, closeSnackbar)

    onClose()
  }

  return (
    <Modal
      description="Edit owner from Safe"
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.smallerModalWindow}
      title="Edit owner from Safe"
    >
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
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
              <Row margin="md">
                <Field
                  className={classes.addressInput}
                  component={TextField}
                  initialValue={selectedOwnerName}
                  name="ownerName"
                  placeholder="Owner name*"
                  testId={RENAME_OWNER_INPUT_TEST_ID}
                  text="Owner name*"
                  type="text"
                  validate={composeValidators(required, minMaxLength(1, 50))}
                />
              </Row>
              <Row>
                <Block className={classes.user} justify="center">
                  <Identicon address={ownerAddress} diameter={32} />
                  <Paragraph color="disabled" noMargin size="md" style={{ marginLeft: sm, marginRight: sm }}>
                    {ownerAddress}
                  </Paragraph>
                  <CopyBtn content={safeAddress} />
                  <IconTrackerBtn type="address" value={safeAddress} />
                </Block>
              </Row>
            </Block>
            <Hairline />
            <Row align="center" className={classes.buttonRow}>
              <Button minHeight={42} minWidth={140} onClick={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                minHeight={42}
                minWidth={140}
                testId={SAVE_OWNER_CHANGES_BTN_TEST_ID}
                type="submit"
                variant="contained"
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

export default withStyles(styles as any)(withSnackbar(EditOwnerComponent))
