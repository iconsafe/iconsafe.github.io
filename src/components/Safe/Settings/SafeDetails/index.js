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

const useStyles = makeStyles(styles)

const SafeDetails = (props) => {
  const classes = useStyles()
  // const latestMasterContractVersion = useSelector(latestMasterContractVersionSelector)
  const safeName = 'ICONSafe' // useSelector(safeNameSelector)
  // const safeNeedsUpdate = useSelector(safeNeedsUpdateSelector)
  const contractVersion = useSelector((state) => state.contractVersion)

  const handleSubmit = (values) => {
    console.log('submit')
  }

  return (
    <>
      <GnoForm onSubmit={handleSubmit}>
        {() => (
          <>
            <Block className={classes.formContainer}>
              <Heading tag='h2'>ICONSafe Version</Heading>
              <Row align='end' grow>
                <Paragraph className={classes.versionNumber}>
                  <ArrowRightIcon />
                  <Link
                    className={cn(classes.item, classes.link)}
                    color='black'
                    target='_blank'
                    to='https://github.com/iconation/ICONSafe/releases'
                  >
                    {contractVersion}
                    {/* {safeNeedsUpdate && ` (there's a newer version: ${latestMasterContractVersion})`} */}
                  </Link>
                </Paragraph>
              </Row>

            </Block>
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
                <Button
                  className={classes.saveBtn}
                  color='primary'
                  size='small'
                  type='submit'
                  variant='contained'
                >
                  Save
                </Button>
              </Col>
            </Row>
          </>
        )}
      </GnoForm>
    </>
  )
}

export default SafeDetails
