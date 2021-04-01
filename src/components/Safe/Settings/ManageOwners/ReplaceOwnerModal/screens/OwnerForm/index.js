import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import classNames from 'classnames/bind'
import React from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import CopyBtn from '@components/core/CopyBtn'
import IconTrackerBtn from '@components/core/IconTrackerBtn'
import Identicon from '@components/core/Identicon'
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

const formMutators = {
  setOwnerAddress: (args, state, utils) => {
    utils.changeValue(state, 'ownerAddress', () => args[0])
  }
}

const OwnerForm = ({ classes, onClose, onSubmit, ownerAddress, ownerName }) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }
  const owners = useSelector((state) => state.walletOwners)
  const ownerDoesntExist = uniqueAddress(owners.map((o) => o.address))

  return (
    <>
      <Row align='center' className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight='bolder'>
          Replace owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm formMutators={formMutators} onSubmit={handleSubmit}>
        {(...args) => {
          const mutators = args[3]

          const handleScan = (value, closeQrModal) => {
            let scannedAddress = value

            if (scannedAddress.startsWith('ethereum:')) {
              scannedAddress = scannedAddress.replace('ethereum:', '')
            }

            mutators.setOwnerAddress(scannedAddress)
            closeQrModal()
          }

          return (
            <>
              <Block className={classes.formContainer}>
                <Row>
                  <Paragraph>
                    Review the owner you want to replace from the active Safe. Then specify the new owner you want to
                    replace it with:
                  </Paragraph>
                </Row>
                <Row>
                  <Paragraph>Current owner</Paragraph>
                </Row>
                <Row className={classes.owner}>
                  <Col align='center' xs={1}>
                    <Identicon className='inverted' address={ownerAddress} diameter={32} />
                  </Col>
                  <Col xs={7}>
                    <Block className={classNames(classes.name, classes.userName)}>
                      <Paragraph noMargin size='lg' weight='bolder'>
                        {ownerName}
                      </Paragraph>
                      <Block className={classes.user} justify='center'>
                        <Paragraph className={classes.address} color='disabled' noMargin size='md'>
                          {ownerAddress}
                        </Paragraph>
                        <CopyBtn content={ownerAddress} />
                        <IconTrackerBtn type='address' value={ownerAddress} />
                      </Block>
                    </Block>
                  </Col>
                </Row>
                <Row>
                  <Paragraph>New owner</Paragraph>
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
                    <ScanQRWrapper handleScan={handleScan} />
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align='center' className={classes.buttonRow}>
                <Button className={classes.button} minWidth={140} onClick={onClose}>
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

export default withStyles(styles)(OwnerForm)
