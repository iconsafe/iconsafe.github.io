import {
  Text,
  Title,
  TextField,
  GenericModal,
  Select,
  ModalFooterConfirmation
} from '@components/ICON'

import Button from '@src/components/core/Button'
import React, { useState, useEffect, useCallback } from 'react'
import Box from '@material-ui/core/Box'
import styled from 'styled-components'
import WidgetWrapper from '../../../components/WidgetWrapper'
import AddressInput from '@src/components/core/AddressInput'
import MenuItem from '@material-ui/core/MenuItem'
import SelectField from '@src/components/core/SelectField'
import Field from '@components/core/Field'
import AmountInput from '@src/components/core/AmountInput'
import TextInput from '@src/components/core/TextInput'
import GnoForm from '@src/components/core/GnoForm'
import { styles } from './style'
import { makeStyles } from '@material-ui/core/styles'
import Col from '@src/components/core/Col'
import Block from '@src/components/core/Block'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { useSelector } from 'react-redux'
import { isICONContractAddress } from '@src/utils/icon'
import { OutgoingTransaction, SubOutgoingTransaction } from '@src/SCORE/MultiSigWalletScore'
import { OutgoingTxDescription } from '@components/Safe/Transactions/TransactionDetails/OutgoingTxDescription'
import { convertTransactionToDisplay } from '@components/Safe/Transactions'
import { composeValidators, required } from '@components/core/validator'

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 100%;
`

const StyledSelect = styled(Select)`
  width: 100%;
`

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`

const StyledText = styled(Text)`
  margin-bottom: 15px;
`

const ModalBody = ({
  txs,
  deleteTx
}) => {
  return (
    <>
      {txs.map((tx, index) => (
        <Box
          key={index}
          display='flex'
          flexDirection='row-reverse'
          alignItems='center'
          justifyContent='space-between'
          width='100%'
        >
          <Button
            size='md'
            variant='outlined'
            iconType='delete'
            color='error'
            onClick={() => deleteTx(index)}
          >
            {''}
          </Button>
          <Text size='lg'>{tx.description}</Text>
        </Box>
      ))}
    </>
  )
}

const useStyles = makeStyles(styles)

const Dashboard = () => {
  const [scoreAddress, setScoreAddress] = useState('')
  const [contract, setContract] = useState(undefined)
  const [userAddress, setUserAddress] = useState(undefined)
  const [subTransactions, setSubTransactions] = useState([])
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [tokenCache, setTokenCache] = useState([])
  const [outTx, setOutTx] = useState(null)
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(null)
  const [inputCache, setInputCache] = useState([])

  const clearTransaction = () => {
    setSubTransactions([])
    setOutTx(null)
  }

  const handleMethod = useCallback(
    async (methodIndex) => {
      if (!contract || contract.length <= methodIndex) return
      setSelectedMethodIndex(methodIndex)
    },
    [contract]
  )

  const handleInput = useCallback(
    async (inputIndex, input) => {
      inputCache[inputIndex] = input
      setInputCache(inputCache.slice())
    },
    [inputCache]
  )

  const onSubmitAddress = (values) => {
    const { inputAddress } = values
    if (isICONContractAddress(inputAddress)) {
      msw.getScoreApi(inputAddress).then(apiList => {
        setScoreAddress(inputAddress)
        setContract(apiList.getList().filter(method => method.type === 'function' && method.readonly !== '0x1'))
      })
    } else {
      setUserAddress(inputAddress)
    }
  }

  useEffect(() => {
    if (subTransactions.length > 0) {
      convertTransactionToDisplay(OutgoingTransaction.create([], [], 'WAITING', subTransactions, 0, 0),
        safeAddress, tokenCache)
        .then(tx => {
          setOutTx(tx)
        })
    } else {
      setOutTx(null)
    }
  }, [JSON.stringify(subTransactions)])

  const getContractMethod = (contract, selectedMethodIndex) =>
    contract && selectedMethodIndex !== null && contract.length > selectedMethodIndex
      ? contract[selectedMethodIndex]
      : null

  const sendIcxTransfer = (values) => {
    const { icxTransferAmount, icxTransferDescription } = values

    const subtx = new SubOutgoingTransaction(
      userAddress,
      '',
      null,
      msw.convertUnitToDecimals(icxTransferAmount, 18),
      icxTransferDescription || ''
    )
    subTransactions.push(subtx)
    setSubTransactions([...subTransactions])
  }

  const makeParam = (methodIndex, paramIndex, paramValue) => {
    return {
      name: contract[methodIndex].inputs[paramIndex].name,
      type: contract[methodIndex].inputs[paramIndex].type,
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
      scoreCallDescription
    )
    subTransactions.push(subtx)
    setSubTransactions([...subTransactions])
  }

  const onSubmitTransactions = () => {
    msw.submit_transaction(subTransactions.map(tx => tx.serialize())).then(tx => {
      clearTransaction()
    })
  }

  const formMutators = {

    setIconAddress: (args, state, utils) => {
      utils.changeValue(state, 'inputAddress', () => args[0])
      setUserAddress(null)
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
      contractMethod && contractMethod.inputs.map((input, index) => {
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
    <Block className={classes.container}>
      <Col className={classes.builder}>
        <WidgetWrapper>

          <GnoForm formMutators={formMutators} onSubmit={(values) => onSubmitAddress(values)}>
            {(...args) => {
              const mutators = args[3]

              return (
                <>
                  <StyledTitle size='sm'>Transaction builder</StyledTitle>

                  <StyledText size='sm'>
                    This app allows you to build a custom transaction with multiple sub-transactions.
                    <br />
                Enter an ICON EOA address or a SCORE address to get started.
                  </StyledText>

                  <Col style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* API Input */}
                    <AddressInput
                      className={classes.addressInput}
                      name='inputAddress'
                      value=''
                      placeholder='Enter Address*'
                      text='Enter Address*'
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

          {userAddress &&
            <GnoForm formMutators={formMutators} onSubmit={(values) => sendIcxTransfer(values)}>
              {(...args) => {
                const mutators = args[3]

                return (
                  <Block style={{ marginTop: '20px' }}>
                    {/* Address Loaded */}
                    <StyledTitle size='sm'>ICX Transfer</StyledTitle>

                    <Col style={{ marginTop: '20px' }}>
                      <AmountInput
                        className={classes.addressInput}
                        name='icxTransferAmount'
                        value={0}
                        placeholder='ICX Amount* (ICX)'
                        text='ICX Amount* (ICX)'
                        fieldMutator={mutators.setIcxTransferAmount}
                      />
                    </Col>

                    <Col style={{ marginTop: '20px' }}>
                      <TextInput
                        isRequired={false}
                        className={classes.addressInput}
                        name='icxTransferDescription'
                        value=''
                        placeholder='Description (optional)'
                        text='Description (optional)'
                        fieldMutator={mutators.setIcxTransferDescription}
                      />
                    </Col>

                    <Col>
                      {/* Actions */}
                      <ButtonContainer>
                        <Button
                          color='primary'
                          type='submit'
                          variant='contained'
                        >
                          Add sub-transaction
                        </Button>
                      </ButtonContainer>
                    </Col>
                  </Block>
                )
              }}
            </GnoForm>}

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
                              isRequired={!input.default}
                              className={classes.addressInput}
                              name={`scoreCallMethodParameter-${index}`}
                              value={`${input.name || ''} (${input.type}) ${(input.default) ? ' (Optional)' : ''}`}
                              placeholder={`${input.name || ''} (${input.type}) ${(input.default) ? ' (Optional)' : ''}`}
                              text={`${input.name || ''} (${input.type}) ${(input.default) ? ' (Optional)' : ''}`}
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
                  </>)
              }}
            </GnoForm>}

        </WidgetWrapper>
      </Col>

      <Col className={classes.icxTransfer}>
        <WidgetWrapper>

          <GnoForm formMutators={formMutators} onSubmit={(values) => onSubmitTransactions(values)}>
            {(...args) => {
              const mutators = args[3]

              return (
                <>
                  <StyledTitle size='sm'>Transaction overview</StyledTitle>
                  {!outTx &&
                    <StyledText size='sm'>
                      Once you added a sub-transaction to your transaction, all the details of your transaction
                      <br /> will be displayed here.
                    </StyledText>}

                  {outTx &&
                    <>
                      <OutgoingTxDescription tx={outTx} defaultOpenedRawMethodCalls />

                      <ButtonContainer style={{ paddingRight: '16px' }}>
                        <Button
                          style={{ marginRight: '32px' }}
                          color='primary'
                          type='submit'
                          onClick={() => clearTransaction()}
                        >Clear Transaction
                        </Button>

                        <Button
                          disabled={!subTransactions.length}
                          color='primary'
                          type='submit'
                          variant='contained'
                        >
                          {`Send Transaction ${subTransactions.length ? `(${subTransactions.length})` : ''}`}
                        </Button>
                      </ButtonContainer>
                    </>}
                </>
              )
            }}
          </GnoForm>
        </WidgetWrapper>
      </Col>
    </Block>
  )
}

export default Dashboard
