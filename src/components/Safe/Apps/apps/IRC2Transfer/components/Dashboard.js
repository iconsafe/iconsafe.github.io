import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { Text, Title } from '@components/ICON'
import Button from '@components/core/Button'
import styled from 'styled-components'
import WidgetWrapper from '@components/Safe/Apps/components/WidgetWrapper'
import GnoForm from '@src/components/core/GnoForm'
import { styles } from './style'
import { makeStyles } from '@material-ui/core/styles'
import Col from '@src/components/core/Col'
import { SubOutgoingTransaction } from '@src/SCORE/MultiSigWalletScore'
import AmountInput from '@src/components/core/AmountInput'
import TextInput from '@src/components/core/TextInput'
import AddressInput from '@src/components/core/AddressInput'
import { ICX_TOKEN_ADDRESS, displayUnit, getTokenSymbol } from '@src/utils/icon'
import { Alert, AlertTitle } from '@material-ui/lab'
import { IconConverter } from 'icon-sdk-js'
import Select from 'react-select'
import Checkbox from '@material-ui/core/Checkbox'

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
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
  const classes = useStyles()
  const [tokenAddress, setTokenAddress] = useState(null)
  const [irc2TransferAmount, setIrc2TransferAmount] = useState(0)
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const multisigBalances = useSelector((state) => state.multisigBalances)
  const [irc2TransferAlertSeverity, setIrc2TransferAlertSeverity] = useState('info')
  const [IRC2Options, setIRC2Options] = useState(null)
  const [selectedIRC2, setSelectedIRC2] = useState(null)
  const [checkboxMax, setCheckboxMax] = useState(false)

  const IRC2 = multisigBalances && tokenAddress && multisigBalances.filter(balance => balance.token === tokenAddress)[0]
  const available = IRC2 && parseFloat(displayUnit(IRC2.balance, IRC2.decimals))

  const formMutators = {

    setTokenAddress: (args, state, utils) => {
      utils.changeValue(state, 'tokenAddress', () => args[0])
    },

    setUserAddress: (args, state, utils) => {
      utils.changeValue(state, 'irc2TransferDestination', () => args[0])
    },

    setIrc2TransferAmount: (args, state, utils) => {
      utils.changeValue(state, 'irc2TransferAmount', () => args[0])
      setIrc2TransferAmount(args[0])
      if (args[0] > available) {
        setIrc2TransferAlertSeverity('warning')
      } else {
        setIrc2TransferAlertSeverity('info')
      }
    },

    setIrc2TransferData: (args, state, utils) => {
      utils.changeValue(state, 'irc2TransferData', () => args[0])
    },

    setIrc2TransferDescription: (args, state, utils) => {
      utils.changeValue(state, 'irc2TransferDescription', () => args[0])
    }
  }

  useEffect(() => {
    if (multisigBalances) {
      setIRC2Options(multisigBalances.filter(token => token.token !== ICX_TOKEN_ADDRESS).map(token => ({
        value: token.token,
        label: `${token.symbol} (${token.token})`
      })))
    }
  }, [JSON.stringify(multisigBalances)])

  const sendIRC2Transfer = (values) => {
    const { irc2TransferDestination, irc2TransferAmount, irc2TransferData, irc2TransferDescription } = values
    const amount = msw.convertUnitToDecimals(irc2TransferAmount, IRC2.decimals)

    const params = [
      { name: '_to', type: 'Address', value: irc2TransferDestination },
      { name: '_value', type: 'int', value: IconConverter.toHex(amount) }
    ]

    if (irc2TransferData) {
      params.push({ name: '_data', type: 'bytes', value: irc2TransferData })
    }

    const subtx = new SubOutgoingTransaction(
      tokenAddress,
      'transfer', params,
      0,
      irc2TransferDescription || ''
    )
    subTransactions.push(subtx)
    setSubTransactions([...subTransactions])
  }

  const onSubmitAddress = (tokenAddress) => {
    setTokenAddress(tokenAddress)
  }

  function handleSelectIRC2 (selectedIRC2) {
    setSelectedIRC2(selectedIRC2)
    onSubmitAddress(selectedIRC2.value)
  }

  return (
    <WidgetWrapper>

      <GnoForm formMutators={formMutators} onSubmit={(values) => onSubmitAddress(values.tokenAddress)}>
        {(...args) => {
          const mutators = args[3]

          return (
            <>
              <StyledTitle size='md'>IRC2 Transfer</StyledTitle>

              <StyledText size='sm'>
                This app allows you to create a simple IRC2 transfer to any address.
              </StyledText>

              <Col style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

                <div className={classes.select}>
                  <Select
                    id='selectedIRC2'
                    name='selectedIRC2'
                    options={IRC2Options}
                    value={selectedIRC2}
                    onChange={handleSelectIRC2}
                    placeholder='Select an IRC2 token…'
                    className='text-lg'
                  />
                </div>
              </Col>
            </>
          )
        }}
      </GnoForm>

      {tokenAddress &&
        <GnoForm formMutators={formMutators} onSubmit={(values) => sendIRC2Transfer(values)}>
          {(...args) => {
            const mutators = args[3]

            const handleCheckboxChange = (event) => {
              setCheckboxMax(event.target.checked)
              if (event.target.checked) {
                const amount = parseFloat(displayUnit(IRC2.balance, IRC2.decimals))
                setIrc2TransferAmount(amount)
                mutators.setIrc2TransferAmount(amount)
              }
            }

            return (
              <>

                <Col style={{ marginTop: '20px' }}>
                  <Alert severity={irc2TransferAlertSeverity}>
                    <AlertTitle>{IRC2.symbol} available for transfer:</AlertTitle>
                    {available.toFixed(5)} {IRC2.symbol}
                  </Alert>
                </Col>

                <Col style={{ marginTop: '20px' }}>
                  <AddressInput
                    className={classes.addressInput}
                    name='inputAddress'
                    value=''
                    placeholder='Enter Destination Address*'
                    text='Enter Destination Address*'
                    fieldMutator={mutators.setUserAddress}
                  />
                </Col>

                <Col style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}>
                  <AmountInput
                    disabled={checkboxMax}
                    className={classes.addressInput}
                    name='irc2TransferAmount'
                    value={irc2TransferAmount}
                    placeholder={`Amount to send* (${IRC2.symbol})`}
                    text={`Amount to send* (${IRC2.symbol})`}
                    fieldMutator={mutators.setIrc2TransferAmount}
                  />

                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Checkbox
                      checked={checkboxMax}
                      onChange={handleCheckboxChange}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    /> <span>MAX</span>
                  </div>
                </Col>

                <Col style={{ marginTop: '20px' }}>
                  <TextInput
                    isRequired={false}
                    className={classes.addressInput}
                    name='irc2TransferData'
                    value=''
                    placeholder='Data (in HEX) (optional)'
                    text='Data (in HEX) (optional)'
                    fieldMutator={mutators.setIrc2TransferData}
                  />
                </Col>

                <Col style={{ marginTop: '20px' }}>
                  <TextInput
                    isRequired={false}
                    className={classes.addressInput}
                    name='irc2TransferDescription'
                    value=''
                    placeholder='Description (optional)'
                    text='Description (optional)'
                    fieldMutator={mutators.setIrc2TransferDescription}
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
              </>
            )
          }}
        </GnoForm>}
    </WidgetWrapper>
  )
}

export default Dashboard
