import React, { useState, useEffect } from 'react'
import { IconConverter } from 'icon-sdk-js'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './style'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import Col from '@src/components/core/Col'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import { Alert, AlertTitle } from '@material-ui/lab'
import Button from '@src/components/core/Button'
import Input from '@material-ui/core/Input'
import { ICX_TOKEN_ADDRESS, displayUnit } from '@src/utils/icon'
import { nFormatter } from '@src/utils/misc'

import { Text, Title } from '@components/ICON'
import GnoForm from '@src/components/core/GnoForm'
import { SubOutgoingTransaction } from '@src/SCORE/MultiSigWalletScore'
import { SCORE_INSTALL_ADDRESS } from '@src/SCORE/Ancilia'

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`

const StyledText = styled(Text)`
  margin-bottom: 15px;
`

const useStyles = makeStyles(styles)
const WITHHOLD_BALANCE = 3

const ICXStaking = ({
  subTransactions, setSubTransactions,
  sumDelegates
}) => {
  const classes = useStyles()
  const [icxMaxStacked, setIcxMaxStacked] = useState(0)
  const [icxStaked, setIcxStaked] = useState(0)
  const [initialIcxStaked, setIcxInitialStaked] = useState(0)
  const multisigBalances = useSelector((state) => state.multisigBalances)
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [checkboxMax, setCheckboxMax] = useState(false)
  const stakingSliderMarks = [
    { value: Math.trunc(0 * (icxMaxStacked / 100)) },
    { value: Math.trunc(10 * (icxMaxStacked / 100)) },
    { value: Math.trunc(20 * (icxMaxStacked / 100)) },
    { value: Math.trunc(30 * (icxMaxStacked / 100)) },
    { value: Math.trunc(40 * (icxMaxStacked / 100)) },
    { value: Math.trunc(50 * (icxMaxStacked / 100)) },
    { value: Math.trunc(60 * (icxMaxStacked / 100)) },
    { value: Math.trunc(70 * (icxMaxStacked / 100)) },
    { value: Math.trunc(80 * (icxMaxStacked / 100)) },
    { value: Math.trunc(90 * (icxMaxStacked / 100)) },
    { value: Math.trunc(100 * (icxMaxStacked / 100)) }
  ]
  const sumDelegatesFloat = parseFloat(displayUnit(sumDelegates, 18)).toFixed(5)

  useEffect(() => {
    if (!multisigBalances) return
    const icxBalance = multisigBalances.filter(balance => balance.token === ICX_TOKEN_ADDRESS)[0]
    const icxStaked = icxBalance.iiss
    const icxBalanceFloat = parseFloat(displayUnit(icxBalance.balance, 18)).toFixed(5)
    const icxStakedFloat = parseFloat(displayUnit(icxStaked.staked ? icxStaked.staked : 0, 18)).toFixed(5)
    const maxStacked = icxBalanceFloat - WITHHOLD_BALANCE
    setIcxMaxStacked(maxStacked < 0 ? 0 : maxStacked)
    setIcxInitialStaked(icxStakedFloat)
    setIcxStaked(icxStakedFloat)
  }, [JSON.stringify(multisigBalances)])

  function valuetext (value) {
    return `${value}`
  }
  const icxStakedPercent = icxMaxStacked === 0 ? 0 : (icxStaked / icxMaxStacked * 100).toFixed(2)

  function getStakeInfoBoxTitle () {
    if (icxStaked < sumDelegatesFloat) {
      return `Delegated = ${sumDelegatesFloat} ICX, wanted stake = ${icxStaked} ICX.`
    }
    return null
  }

  function getStakeInfoBox () {
    if (icxStaked < sumDelegatesFloat) {
      return 'ERROR : Your stake needs to be greater or equal to your delegation.'
    }

    if (icxStaked < initialIcxStaked) {
      return `Unstaking -${initialIcxStaked - icxStaked} ICX from the staked ICX.`
    }

    return `Adding +${icxStaked - initialIcxStaked} ICX to the staked ICX.`
  }

  function getStakeIconBox () {
    if (icxStaked < sumDelegatesFloat) {
      return 'error'
    }
    if (icxStaked < initialIcxStaked) {
      return 'warning'
    }
    return 'info'
  }

  const submitIcxStake = () => {
    const subtx = new SubOutgoingTransaction(SCORE_INSTALL_ADDRESS, 'setStake', [
      { name: 'value', type: 'int', value: IconConverter.toHex(msw.convertUnitToDecimals(icxStaked, 18)) }
    ], 0, `Set stake amount to ${icxStaked} ICX`
    )
    subTransactions.push(subtx)
    setSubTransactions([...subTransactions])
  }

  const handleCheckboxChange = (event) => {
    setCheckboxMax(event.target.checked)
    if (event.target.checked) {
      setIcxStaked(icxMaxStacked)
    }
  }

  const handleSliderChange = (event, newValue) => {
    setIcxStaked(newValue)
  }

  const handleInputChange = (event) => {
    let number = Number(event.target.value)
    if (isNaN(number)) {
      number = 0
    }
    setIcxStaked(event.target.value === '' ? '' : number)
  }

  const handleBlur = () => {
    if (icxStaked < 0) {
      setIcxStaked(0)
    } else if (icxStaked > icxMaxStacked) {
      setIcxStaked(icxMaxStacked)
    }
  }

  const ICXFormatter = (icx) => {
    return nFormatter(icx, 0)
  }

  return (
    <GnoForm formMutators={{}} onSubmit={(values) => submitIcxStake(values)}>
      {(...args) => {
        // const mutators = args[3]

        return (
          <div className={classes.section}>
            <StyledTitle size='md'>ICX Staking</StyledTitle>

            <StyledText size='sm'>
              Adjust the amount of ICX you want to stake from the multisig wallet. The staking app will automatically keep at least {WITHHOLD_BALANCE} ICX in the balance.
            </StyledText>

            <Col style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

              <div className={classes.slider}>

                <div className={classes.stakeChoser}>
                  <div>
                  </div>
                  <div>
                    <Checkbox
                      checked={checkboxMax}
                      onChange={handleCheckboxChange}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    /> Stake Max ?
                  </div>
                </div>

                <Grid container spacing={5} alignItems='center'>
                  <Grid item xs>
                    <Slider
                      disabled={checkboxMax}
                      value={icxStaked}
                      onChange={handleSliderChange}
                      max={icxMaxStacked}
                      getAriaValueText={valuetext}
                      aria-labelledby='discrete-slider-custom'
                      valueLabelDisplay='on'
                      valueLabelFormat={value => <div>{ICXFormatter(value)}</div>}
                      marks={stakingSliderMarks}
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      disabled={checkboxMax}
                      className={classes.input}
                      value={icxStaked}
                      margin='dense'
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: icxMaxStacked,
                        'aria-labelledby': 'discrete-slider-custom'
                      }}
                    />
                  </Grid>
                </Grid>
              </div>

            </Col>

            <StyledText size='xl'>
              ICX Staked : {icxStaked} / {icxMaxStacked} ({icxStakedPercent} %)
            </StyledText>

            <Col className={classes.alertvotes}>
              <Alert severity={getStakeIconBox()}>
                <AlertTitle>{getStakeInfoBox()}</AlertTitle>
                {getStakeInfoBoxTitle()}
              </Alert>
            </Col>

            {/* Submit */}
            <div style={{ height: '55px' }}>
              <Button
                className={classes.buttonSubmit}
                color='primary'
                type='submit'
                variant='contained'
              >
                Add sub-transaction
              </Button>
            </div>
          </div>
        )
      }}
    </GnoForm>
  )
}

export default ICXStaking
