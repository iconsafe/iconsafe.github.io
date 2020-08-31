import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'

import { styles } from './style'

import Field from '@components/core/Field'
import GnoForm from '@components/core/GnoForm'
import SelectField from '@components/core/SelectField'
import { composeValidators, differentFrom, minValue, mustBeInteger, required } from '@components/core/validator'
import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Col from '@components/core/Col'
import Hairline from '@components/core/Hairline'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'
// import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
// import { estimateTxGasCosts } from 'src/logic/safe/transactions/gasNew'
// import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
// import { getWeb3 } from 'src/logic/wallets/getWeb3'

const THRESHOLD_FIELD_NAME = 'threshold'

const ChangeThreshold = ({ classes, onChangeThreshold, onClose, owners, threshold }) => {
  const handleSubmit = (values) => {
    const newThreshold = values[THRESHOLD_FIELD_NAME]
    onClose()
    onChangeThreshold(newThreshold)
  }

  return (
    <>
      <Row align='center' className={classes.heading} grow>
        <Paragraph className={classes.headingText} noMargin weight='bolder'>
          Change required confirmations
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm initialValues={{ threshold: threshold.toString() }} onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.modalContent}>
              <Row>
                <Paragraph weight='bolder'>Any transaction requires the confirmation of:</Paragraph>
              </Row>
              <Row align='center' className={classes.inputRow} margin='xl'>
                <Col xs={2}>
                  <Field
                    data-testid='threshold-select-input'
                    name={THRESHOLD_FIELD_NAME}
                    render={(props) => (
                      <>
                        <SelectField {...props} disableError>
                          {[...Array(Number(owners.length))].map((x, index) => (
                            <MenuItem key={index} value={`${index + 1}`}>
                              {index + 1}
                            </MenuItem>
                          ))}
                        </SelectField>
                        {props.meta.error && props.meta.touched && (
                          <Paragraph className={classes.errorText} color='error' noMargin>
                            {props.meta.error}
                          </Paragraph>
                        )}
                      </>
                    )}
                    validate={composeValidators(required, mustBeInteger, minValue(1), differentFrom(threshold))}
                  />
                </Col>
                <Col xs={10}>
                  <Paragraph className={classes.ownersText} color='primary' noMargin size='lg'>
                    {`out of ${owners.length} owner(s)`}
                  </Paragraph>
                </Col>
              </Row>
              <Row>
                <Paragraph>
                  You're about to create a transaction and will have to confirm it with your currently connected wallet in the transaction list.
                </Paragraph>
              </Row>
            </Block>
            <Hairline style={{ position: 'absolute', bottom: 85 }} />
            <Row align='center' className={classes.buttonRow}>
              <Button minWidth={140} onClick={onClose}>
                Back
              </Button>
              <Button color='primary' minWidth={140} type='submit' variant='contained'>
                Change
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(ChangeThreshold)
