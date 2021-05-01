import {
  Text,
  Title
} from '@components/ICON'

import Button from '@components/core/Button'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import WidgetWrapper from '@components/Safe/Apps/components/WidgetWrapper'
import AddressInput from '@components/core/AddressInput'
import MenuItem from '@material-ui/core/MenuItem'
import SelectField from '@components/core/SelectField'
import Field from '@components/core/Field'
import AmountInput from '@components/core/AmountInput'
import TextInput from '@components/core/TextInput'
import GnoForm from '@components/core/GnoForm'
import { styles } from './style'
import { makeStyles } from '@material-ui/core/styles'
import Col from '@components/core/Col'
import Block from '@components/core/Block'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { useSelector } from 'react-redux'
import { isICONContractAddress } from '@src/utils/icon'
import { SubOutgoingTransaction } from '@src/SCORE/MultiSigWalletScore'
import { composeValidators, required } from '@components/core/validator'

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 100%;
`

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`

const StyledText = styled(Text)`
  margin-bottom: 15px;
`

const useStyles = makeStyles(styles)

const Dashboard = ({ subTransactions, setSubTransactions }) => {
  const [scoreAddress, setScoreAddress] = useState('')
  const [contract, setContract] = useState(undefined)
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(null)

  const onSubmitAddress = (values) => {
    const { inputAddress } = values
    msw.getScoreApi(inputAddress).then(apiList => {
      setScoreAddress(inputAddress)
      setContract(apiList.getList().filter(method => method.type === 'function' && method.readonly !== '0x1'))
    })
  }

  const getContractMethod = (contract, selectedMethodIndex) =>
    contract && selectedMethodIndex !== null && contract.length > selectedMethodIndex
      ? contract[selectedMethodIndex]
      : null

  const makeParam = (methodIndex, paramIndex, paramValue) => {
    let type = contract[methodIndex].inputs[paramIndex].type

    // ICONSafe complex types convertion
    if (type == "[]struct") type = "List"

    return {
      name: contract[methodIndex].inputs[paramIndex].name,
      type: type,
      value: paramValue
    }
  }

  const sendScoreCall = (values) => {
    const { scoreCallMethodIndex, scoreCallDescription, scoreCallMethodParameters, scoreCallIcxAmount } = values
    const method = contract[scoreCallMethodIndex]

    const params = scoreCallMethodParameters
      ? JSON.stringify(scoreCallMethodParameters.map((value, index) => makeParam(scoreCallMethodIndex, index, value)))
      : null

    const subtx = new SubOutgoingTransaction(
      scoreAddress,
      method.name,
      params,
      msw.convertUnitToDecimals(scoreCallIcxAmount || 0, 18),
      scoreCallDescription || ''
    )
    subTransactions.push(subtx)
    setSubTransactions([...subTransactions])
  }

  const formMutators = {

    setIconAddress: (args, state, utils) => {
      utils.changeValue(state, 'inputAddress', () => args[0])
      setScoreAddress(null)
      setContract(null)
    },

    setIcxTransferAmount: (args, state, utils) => {
      utils.changeValue(state, 'icxTransferAmount', () => args[0])
    },

    setIcxTransferDescription: (args, state, utils) => {
      utils.changeValue(state, 'icxTransferDescription', () => args[0])
    },

    setScoreCallIcxAmount: (args, state, utils) => {
      utils.changeValue(state, 'scoreCallIcxAmount', () => args[0])
    },

    setScoreCallMethodIndex: (args, state, utils) => {
      // Reset
      const contractMethod = getContractMethod(contract, selectedMethodIndex)
      contractMethod && contractMethod.inputs.forEach((input, index) => {
        utils.changeValue(state, `scoreCallMethodParameter-${index}`, () => undefined)
      })
      utils.changeValue(state, 'scoreCallIcxAmount', () => undefined)
      utils.changeValue(state, 'scoreCallMethodParameters', () => undefined)
      utils.changeValue(state, 'scoreCallDescription', () => undefined)

      // Set
      setSelectedMethodIndex(args[0])
      utils.changeValue(state, 'scoreCallMethodIndex', () => args[0])
    },

    setScoreCallDescription: (args, state, utils) => {
      utils.changeValue(state, 'scoreCallDescription', () => args[0])
    },

    setScoreCallMethodParameters: (args, state, utils) => {
      utils.changeValue(state, 'scoreCallMethodParameters', (oldValue) => {
        if (!oldValue) { oldValue = [] }
        oldValue[args[1]] = args[0]
        return oldValue
      })
    }
  }

  const classes = useStyles()

  return (
    <WidgetWrapper>

      <GnoForm formMutators={formMutators} onSubmit={(values) => onSubmitAddress(values)}>
        {(...args) => {
          const mutators = args[3]

          return (
            <>
              <StyledTitle size='md'>Transaction builder</StyledTitle>

              <StyledText size='sm'>
                This app allows you to build a custom transaction to any SCORE contract or transfer ICX to any EOA.
                <br />
                Enter an ICON EOA address or a SCORE address to get started.
              </StyledText>

              <Col style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                {/* API Input */}
                <AddressInput
                  className={classes.addressInput}
                  name='inputAddress'
                  value=''
                  placeholder='Enter SCORE Address*'
                  text='Enter SCORE Address*'
                  fieldMutator={mutators.setIconAddress}
                />
                <div style={{ height: '55px' }}>
                  <Button
                    className={classes.buttonSubmitContract}
                    color='primary'
                    type='submit'
                    variant='contained'
                  >
                    Submit
                  </Button>
                </div>
              </Col>
            </>
          )
        }}
      </GnoForm>

      {scoreAddress && contract &&
        <GnoForm formMutators={formMutators} onSubmit={(values) => sendScoreCall(values)}>
          {(...args) => {
            const mutators = args[3]

            const contractMethod = getContractMethod(contract, selectedMethodIndex)
            const methodIsPayable = contractMethod?.payable === '0x1'

            return (
              <>
                <Block style={{ marginTop: '20px' }}>

                  {contract.length > 0 && (

                    <Field
                      name='scoreCallMethodIndex'
                      data-testid='threshold-select-input'
                      render={(props) => (
                        <>
                          <SelectField
                            fieldMutator={mutators.setScoreCallMethodIndex} disableError
                            label='Method Name'
                            {...props}
                          >
                            {contract.map((x, index) => (
                              <MenuItem
                                selected={index === 0}
                                key={index} value={`${index}`}
                              >
                                {x.name}
                              </MenuItem>
                            ))}
                          </SelectField>
                        </>
                      )}
                      validate={composeValidators(required)}
                    />
                  )}

                  {contractMethod &&
                    <>
                      {contractMethod.inputs.map((input, index) => (
                        <TextInput
                          key={index}
                          isRequired={input.default === undefined}
                          className={classes.addressInput}
                          name={`scoreCallMethodParameter-${index}`}
                          value={`${input.name || ''} (${input.type}) ${(input.default === undefined) ? '' : ' (Optional)'}`}
                          placeholder={`${input.name || ''} (${input.type}) ${(input.default === undefined) ? '' : ' (Optional)'}`}
                          text={`${input.name || ''} (${input.type}) ${(input.default === undefined) ? '' : ' (Optional)'}`}
                          fieldMutator={(value) => { mutators.setScoreCallMethodParameters(value, index) }}
                        />
                      ))}

                      {methodIsPayable &&
                        <AmountInput
                          isRequired
                          className={classes.addressInput}
                          name='scoreCallIcxAmount'
                          value={0}
                          placeholder='ICX Amount (ICX)'
                          text='ICX Amount (ICX)'
                          fieldMutator={(value) => { mutators.setScoreCallIcxAmount(value) }}
                        />}

                      <Col style={{ marginTop: '20px' }}>
                        <TextInput
                          isRequired={false}
                          className={classes.addressInput}
                          name='scoreCallDescription'
                          value=''
                          placeholder='Description (optional)'
                          text='Description (optional)'
                          fieldMutator={mutators.setScoreCallDescription}
                        />
                      </Col>

                    </>}

                  {contractMethod &&
                    <Col>
                      <ButtonContainer>
                        <Button
                          color='primary'
                          type='submit'
                          variant='contained'
                        >
                          Add sub-transaction
                        </Button>
                      </ButtonContainer>
                    </Col>}
                </Block>
              </>
            )
          }}
        </GnoForm>}

    </WidgetWrapper>
  )
}

export default Dashboard
