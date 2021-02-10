import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import { styles } from './style'
import Field from '@components/core/Field'
import GnoForm from '@components/core/GnoForm'
import TextField from '@components/core/TextField'
import { composeValidators, minMaxLength, required } from '@components/core/validator'
import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Col from '@components/core/Col'
import Heading from '@components/core/Heading'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'
import Link from '@components/core/Link'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import SaveIcon from '@material-ui/icons/Save'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { lowercaseWithCapital } from '@src/utils/strings'

const useStyles = makeStyles(styles)

const SafeSettings = () => {
  const classes = useStyles()
  const safeName = useSelector((state) => state.safeName)
  const contractVersions = useSelector((state) => state.contractVersions)

  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const granted = useSelector((state) => state.granted)

  const handleSubmit = (values) => {
    msw.set_safe_name(values.safeName)
  }

  return (
    <>
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.formContainer}>
              <Heading tag='h2'>Modify Safe name</Heading>
              <Block className={classes.safeNameInputField}>
                <Field
                  component={TextField}
                  defaultValue={safeName}
                  name='safeName'
                  placeholder='Safe name*'
                  text='Safe name*'
                  type='text'
                  validate={composeValidators(required, minMaxLength(1, 50))}
                />
              </Block>
            </Block>

            <Row align='end' className={classes.controlsRow} grow>
              <Col end='xs'>
                {granted &&
                  <Button
                    className={classes.saveBtn}
                    color='primary'
                    size='small'
                    type='submit'
                    variant='contained'
                  >
                    <SaveIcon /> &nbsp; Save
                  </Button>}
              </Col>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}

export default SafeSettings
