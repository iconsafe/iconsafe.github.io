import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import React from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import Field from '@components/core/Field'
import GnoForm from '@components/core/GnoForm'
import SelectField from '@components/core/SelectField'
import { composeValidators, maxValue, minValue, mustBeInteger, required } from '@components/core/validator'
import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Col from '@components/core/Col'
import Hairline from '@components/core/Hairline'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'

const ThresholdForm = ({ classes, onClickBack, onClose, onSubmit }) => {
  const owners = useSelector((state) => state.walletOwners)
  const threshold = useSelector((state) => state.walletOwnersRequired)
  const handleSubmit = (values) => {
    onSubmit(values)
  }
  const defaultThreshold = threshold > 1 ? threshold - 1 : threshold

  return (
    <>
      <Row align='center' className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight='bolder'>
          Remove owner
        </Paragraph>
        <Paragraph className={classes.annotation}>2 of 3</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <GnoForm initialValues={{ threshold: defaultThreshold.toString() }} onSubmit={handleSubmit}>
        {() => {
          const numOptions = owners.length > 1 ? owners.length - 1 : 1

          return (
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
                <Button minHeight={42} minWidth={140} onClick={onClickBack}>
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
          )
        }}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(ThresholdForm)
