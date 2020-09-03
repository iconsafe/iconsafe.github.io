import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import Field from '@src/components/core/Field'
import GnoForm from '@src/components/core/GnoForm'
import SelectField from '@src/components/core/SelectField'
import { composeValidators, maxValue, minValue, mustBeInteger, required } from '@src/components/core/validator'
import Block from '@src/components/core/Block'
import Button from '@src/components/core/Button'
import Col from '@src/components/core/Col'
import Hairline from '@src/components/core/Hairline'
import Paragraph from '@src/components/core/Paragraph'
import Row from '@src/components/core/Row'

const ThresholdForm = ({ classes, onClickBack, onClose, onSubmit }) => {
  const threshold = useSelector((state) => state.walletOwnersRequired)
  const owners = useSelector((state) => state.walletOwners)
  const handleSubmit = (values) => {
    onSubmit(values)
  }

  return (
    <>
      <Row align='center' className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight='bolder'>
          Add new owner
        </Paragraph>
        <Paragraph className={classes.annotation}>2 of 2</Paragraph>
        <IconButton disableRipple onClick={() => onClose()}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm initialValues={{ threshold: threshold.toString() }} onSubmit={(values) => handleSubmit(values)}>
        {() => (
          <>
            <Block className={classes.formContainer}>
              <Row>
                <Paragraph className={classes.headingText} weight='bolder'>
                  Set the required owner confirmations:
                </Paragraph>
              </Row>
            </Block>
            <Hairline />
            <Row align='center' className={classes.buttonRow}>
              <Button minHeight={42} minWidth={140} onClick={() => onClickBack()}>
                Back
              </Button>
              <Button
                color='primary'
                minHeight={42}
                minWidth={140}
                type='submit'
                variant='contained'
              >
                Review
              </Button>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(ThresholdForm)
