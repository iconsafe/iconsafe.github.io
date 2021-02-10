import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { Text, Title } from '@components/ICON'
import Button from '@components/core/Button'
import styled from 'styled-components'
import WidgetWrapper from '@components/Safe/Apps/components/WidgetWrapper'
import GnoForm from '@components/core/GnoForm'
import { styles } from './style'
import { makeStyles } from '@material-ui/core/styles'
import Col from '@components/core/Col'
import { SubOutgoingTransaction } from '@src/SCORE/MultiSigWalletScore'
import AmountInput from '@components/core/AmountInput'
import TextInput from '@components/core/TextInput'
import AddressInput from '@components/core/AddressInput'
import { ZERO, ICX_TOKEN_ADDRESS, displayUnit, ICX_TOKEN_DECIMALS } from '@src/utils/icon'
import { Alert, AlertTitle } from '@material-ui/lab'
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
  const [userAddress, setUserAddress] = useState(undefined)
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const multisigBalances = useSelector((state) => state.multisigBalances)
  const [icxTransferAlertSeverity, setIcxTransferAlertSeverity] = useState('info')
  const [checkboxMax, setCheckboxMax] = useState(false)
  const [icxTransferAmount, setIcxTransferAmount] = useState(0)

  const icxBalance = multisigBalances && multisigBalances.filter(balance => balance.token === ICX_TOKEN_ADDRESS)[0].iiss
  const available = parseFloat(displayUnit(icxBalance?.available, 18))

  const formMutators = {

    setIconAddress: (args, state, utils) => {
      utils.changeValue(state, 'inputAddress', () => args[0])
      setUserAddress(args[0])
    },

    setIcxTransferAmount: (args, state, utils) => {
      utils.changeValue(state, 'icxTransferAmount', () => args[0])
      setIcxTransferAmount(args[0])
      if (args[0] > available) {
        setIcxTransferAlertSeverity('warning')
      } else {
        setIcxTransferAlertSeverity('info')
      }
    },

    setIcxTransferDescription: (args, state, utils) => {
      utils.changeValue(state, 'icxTransferDescription', () => args[0])
    }
  }

  const classes = useStyles()

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

  return (
    <WidgetWrapper>

      <GnoForm formMutators={formMutators} onSubmit={(values) => sendIcxTransfer(values)}>
        {(...args) => {
          const mutators = args[3]

          const handleCheckboxChange = (event) => {
            setCheckboxMax(event.target.checked)
            if (event.target.checked) {
              mutators.setIcxTransferAmount(available)
              setIcxTransferAmount(available)
            }
          }

          return (
            <>
              <StyledTitle size='md'>ICX Transfer</StyledTitle>

              <StyledText size='sm'>
                This app allows you to create a simple ICX transfer to any address.
              </StyledText>

              <Col style={{ marginTop: '20px' }}>
                <Alert severity={icxTransferAlertSeverity}>
                  <AlertTitle>ICX available for transfer:</AlertTitle>
                  {available.toFixed(5)} ICX
                </Alert>
              </Col>

              <Col style={{ marginTop: '20px' }}>
                <AddressInput
                  className={classes.addressInput}
                  name='inputAddress'
                  value=''
                  placeholder='Enter Destination Address*'
                  text='Destination Enter Address*'
                  fieldMutator={mutators.setIconAddress}
                />
              </Col>

              <Col style={{ marginTop: '20px', display: 'flex', flexDirection: 'row' }}>
                <AmountInput
                  disabled={checkboxMax}
                  className={classes.addressInput}
                  name='icxTransferAmount'
                  value={icxTransferAmount}
                  placeholder='Amount to send* (ICX)'
                  text='Amount to send* (ICX)'
                  fieldMutator={mutators.setIcxTransferAmount}
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
            </>
          )
        }}
      </GnoForm>
    </WidgetWrapper>
  )
}

export default Dashboard
