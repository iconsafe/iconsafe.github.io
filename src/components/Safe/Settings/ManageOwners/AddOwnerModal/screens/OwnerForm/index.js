import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'
import { useSelector } from 'react-redux'
import { ScanQRWrapper } from '@components/ScanQRModal/ScanQRWrapper'
import AddressInput from '@components/core/AddressInput'
import Field from '@components/core/Field'
import GnoForm from '@components/core/GnoForm'
import TextField from '@components/core/TextField'
import { composeValidators, minMaxLength, required, uniqueAddress } from '@components/core/validator'
import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Col from '@components/core/Col'
import Hairline from '@components/core/Hairline'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'
import { styles } from './style'

const useStyles = makeStyles(styles)

const formMutators = {
  setOwnerAddress: (args, state, utils) => {
    utils.changeValue(state, 'ownerAddress', () => args[0])
  }
}

const OwnerForm = ({ onClose, onSubmit }) => {
  const classes = useStyles()
  const handleSubmit = (values) => {
    onSubmit(values)
  }
  const owners = useSelector((state) => state.walletOwners)
  const ownerDoesntExist = uniqueAddress(owners.map((o) => o.address))

  return (
    <>
      <Row align='center' className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight='bolder'>
          Add new owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton disableRipple onClick={() => onClose()}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm formMutators={formMutators} onSubmit={(values) => handleSubmit(values)}>
        {(...args) => {
          const mutators = args[3]

          const handleScan = (value, closeQrModal) => {
            mutators.setOwnerAddress(value)
            closeQrModal()
          }

          return (
            <>
              <Block className={classes.formContainer}>
                <Row margin='md'>
                  <Paragraph>Add a new owner to the active Safe</Paragraph>
                </Row>
                <Row margin='md'>
                  <Col xs={8}>
                    <Field
                      className={classes.addressInput}
                      component={TextField}
                      name='ownerName'
                      placeholder='Owner name*'
                      text='Owner name*'
                      type='text'
                      validate={composeValidators(required, minMaxLength(1, 50))}
                    />
                  </Col>
                </Row>
                <Row margin='md'>
                  <Col xs={8}>
                    <AddressInput
                      className={classes.addressInput}
                      fieldMutator={mutators.setOwnerAddress}
                      name='ownerAddress'
                      placeholder='Owner address*'
                      text='Owner address*'
                      validators={[ownerDoesntExist]}
                    />
                  </Col>
                  <Col center='xs' className={classes} middle='xs' xs={1}>
                    <ScanQRWrapper handleScan={(value, closeQrModal) => handleScan(value, closeQrModal)} />
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align='center' className={classes.buttonRow}>
                <Button className={classes.button} minWidth={140} onClick={() => onClose()}>
                  Cancel
                </Button>
                <Button
                  className={classes.button}
                  color='primary'
                  minWidth={140}
                  type='submit'
                  variant='contained'
                >
                  Next
                </Button>
              </Row>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default OwnerForm
