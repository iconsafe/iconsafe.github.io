import { withStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { FormSpy } from 'react-final-form'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import { useDispatch } from 'react-redux'
import { setForceReload } from '@src/store/actions'

import { styles } from './style'
import { getSymbolAndDecimalsFromContract } from '@src/utils/ancilia'

import Field from '@components/core/Field/index'
import GnoForm from '@components/core/GnoForm'
import TextField from '@components/core/TextField'
import AddressInput from '@components/core/AddressInput'
import { mustBeIRC2ContractAddress, mustBeICONContractAddress } from '@components/core/validator'
import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Col from '@components/core/Col'
import Hairline from '@components/core/Hairline'
import Img from '@components/core/Img'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'
import { getTokenIcon } from '@components/TokenIcon'

import classNames from 'classnames/bind'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { getSafeAddress } from '@src/utils/route'

const cx = classNames.bind(styles)

const INITIAL_FORM_STATE = {
  address: '',
  decimals: '',
  symbol: ''
}

const AddCustomToken = ({
  classes,
  onClose
}) => {
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE)
  const [tokenLogo, setTokenLogo] = useState('GENERIC_TOKEN')
  const msw = getMultiSigWalletAPI(getSafeAddress())
  const dispatch = useDispatch()

  const handleSubmit = (values, msw) => {
    const address = values.address

    msw.add_balance_tracker(address).then((tx) => {
      msw.txResult(tx.result).then(() => {
        dispatch(setForceReload(true))
        onClose()
      })
    })
  }

  const populateFormValuesFromAddress = async (tokenAddress) => {
    const tokenData = await getSymbolAndDecimalsFromContract(tokenAddress)

    if (tokenData) {
      const { symbol, decimals } = tokenData

      setTokenLogo(symbol)

      setFormValues({
        address: tokenAddress,
        symbol: symbol,
        decimals: decimals,
        name: symbol
      })
    }
  }

  const formSpyOnChangeHandler = async (state) => {
    const { dirty, errors, submitSucceeded, validating, values } = state
    // for some reason this is called after submitting, we don't need to update the values
    // after submit
    if (submitSucceeded) {
      return
    }

    if (dirty && !validating && errors.address) {
      setFormValues(INITIAL_FORM_STATE)
    }

    if (!errors.address && !validating && dirty) {
      await populateFormValuesFromAddress(values.address)
    }
  }

  const formMutators = {
    setTokenAddress: (args, state, utils) => {
      setTokenLogo('GENERIC_TOKEN')
      utils.changeValue(state, 'address', () => args[0])
    }
  }

  return (
    <>
      <Row align='center' className={classes.heading} grow>
        <Paragraph noMargin size='xl' weight='bolder'>
          Add token
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>

      <Hairline />

      <GnoForm
        initialValues={formValues}
        onSubmit={(values) => { handleSubmit(values, msw) }}
        formMutators={formMutators}
      >
        {(...args) => {
          const mutators = args[3]

          return (
            <>
              <Block className={classes.formContainer}>
                <Paragraph className={classes.title} noMargin size='lg' weight='bolder'>
                  Input below the token contract address:
                </Paragraph>
                <AddressInput
                  validators={[mustBeICONContractAddress, mustBeIRC2ContractAddress]}
                  fieldMutator={mutators.setTokenAddress}
                  className={classes.addressInput}
                  name='address'
                  placeholder='Token contract address'
                  text='Token contract address'
                />
                <FormSpy
                  onChange={formSpyOnChangeHandler}
                  subscription={{
                    values: true,
                    errors: true,
                    validating: true,
                    dirty: true,
                    submitSucceeded: true
                  }}
                />

                <Hairline />
                <Row align='center' className={classes.heading} grow>
                  <Col layout='column' xs={6}>
                    <Field
                      className={cx(classes.addressInput, classes.tokenSymbol)}
                      component={TextField}
                      disabled
                      name='symbol'
                      placeholder='Token symbol'
                      text='Token symbol'
                      type='text'
                    />
                    <Field
                      className={classes.addressInput}
                      component={TextField}
                      disabled
                      name='decimals'
                      placeholder='Token decimals'
                      text='Token decimals'
                      type='text'
                    />
                  </Col>
                  <Col align='center' layout='column' xs={6}>
                    <Paragraph className={classes.tokenImageHeading}>Token Logo</Paragraph>
                    <Img
                      className={classes.tokenLogo}
                      alt='Token image'
                      height={100}
                      width={100}
                      src={getTokenIcon(tokenLogo).src}
                    />
                  </Col>
                </Row>
              </Block>
              <Hairline />
              <Row align='center' className={classes.buttonRow}>
                <Button color='primary' minHeight={42} minWidth={140} onClick={onClose}>
                  Cancel
                </Button>
                <Button color='primary' minHeight={42} minWidth={140} type='submit' variant='contained'>
                  Save
                </Button>
              </Row>
            </>
          )
        }}
      </GnoForm>
    </>
  )
}

export default withStyles(styles)(AddCustomToken)
