import React, { useState, useEffect } from 'react'
import { IconConverter } from 'icon-sdk-js'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './style'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import Col from '@components/core/Col'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import { Alert, AlertTitle } from '@material-ui/lab'
import Button from '@components/core/Button'
import Input from '@material-ui/core/Input'
import { BALANCED_SCORES } from '@src/SCORE/Balanced'
import { displayUnit } from '@src/utils/icon'
import { nFormatter } from '@src/utils/misc'
import { Text, Title } from '@components/ICON'
import GnoForm from '@components/core/GnoForm'
import { SubOutgoingTransaction } from '@src/SCORE/MultiSigWalletScore'

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`

const StyledText = styled(Text)`
  margin-bottom: 15px;
`
const WITHHOLD_BALANCE = 0.1

const useStyles = makeStyles(styles)

const BALNStaking = ({subTransactions, setSubTransactions, claimedReward}) => {
  const classes = useStyles()
  const [balnMaxStacked, seBalnMaxStacked] = useState(0)
  const [balnStaked, seBalnStaked] = useState(0)
  const [initialIcxStaked, seBalnInitialStaked] = useState(0)
  const multisigBalances = useSelector((state) => state.multisigBalances)
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [checkboxMax, setCheckboxMax] = useState(false)
  const stakingSliderMarks = [
    { value: Math.trunc(0 * (balnMaxStacked / 100)) },
    { value: Math.trunc(10 * (balnMaxStacked / 100)) },
    { value: Math.trunc(20 * (balnMaxStacked / 100)) },
    { value: Math.trunc(30 * (balnMaxStacked / 100)) },
    { value: Math.trunc(40 * (balnMaxStacked / 100)) },
    { value: Math.trunc(50 * (balnMaxStacked / 100)) },
    { value: Math.trunc(60 * (balnMaxStacked / 100)) },
    { value: Math.trunc(70 * (balnMaxStacked / 100)) },
    { value: Math.trunc(80 * (balnMaxStacked / 100)) },
    { value: Math.trunc(90 * (balnMaxStacked / 100)) },
    { value: Math.trunc(100 * (balnMaxStacked / 100)) }
  ]

  useEffect(() => {
    if (!multisigBalances) return
    const balnBalance = multisigBalances.filter(balance => balance.token === BALANCED_SCORES['baln'])[0]
    const balnStaked = balnBalance.baln.staked
    const maxStacked = (parseFloat(displayUnit(balnBalance.balance.plus(claimedReward), 18)) - WITHHOLD_BALANCE).toFixed(5)
    const balnStakedFloat = parseFloat(displayUnit(balnStaked ? balnStaked : 0, 18)).toFixed(5)
    seBalnMaxStacked(maxStacked < 0 ? 0 : maxStacked)
    seBalnInitialStaked(balnStakedFloat)
    seBalnStaked(balnStakedFloat)
  }, [JSON.stringify(multisigBalances), claimedReward])

  function valuetext (value) {
    return `${value}`
  }
  const balnStakedPercent = balnMaxStacked === 0 ? 0 : (balnStaked / balnMaxStacked * 100).toFixed(2)

  function getStakeInfoBoxTitle () {
    return null
  }

  function getStakeInfoBox () {
    if (balnStaked < initialIcxStaked) {
      return `Unstaking -${initialIcxStaked - balnStaked} BALN from the staked BALN.`
    }

    return `Adding +${balnStaked - initialIcxStaked} BALN to the staked BALN.`
  }

  function getStakeIconBox () {
    if (balnStaked < initialIcxStaked) {
      return 'warning'
    }
    return 'info'
  }

  const submiBalnStake = () => {
    const subtx = new SubOutgoingTransaction(BALANCED_SCORES['baln'], 'stake', [
      { name: '_value', type: 'int', value: IconConverter.toHex(msw.convertUnitToDecimals(balnStaked, 18)) }
    ], 0, `Set stake amount to ${balnStaked} BALN`
    )
    subTransactions.push(subtx)
    setSubTransactions([...subTransactions])
  }

  const handleCheckboxChange = (event) => {
    setCheckboxMax(event.target.checked)
    if (event.target.checked) {
      seBalnStaked(balnMaxStacked)
    }
  }

  const handleSliderChange = (event, newValue) => {
    seBalnStaked(newValue)
  }

  const handleInputChange = (event) => {
    let number = Number(event.target.value)
    if (isNaN(number)) {
      number = 0
    }
    seBalnStaked(event.target.value === '' ? '' : number)
  }

  const handleBlur = () => {
    if (balnStaked < 0) {
      seBalnStaked(0)
    } else if (balnStaked > balnMaxStacked) {
      seBalnStaked(balnMaxStacked)
    }
  }

  const BALNFormatter = (baln) => {
    return nFormatter(baln, 0)
  }

  return (
    <GnoForm formMutators={{}} onSubmit={(values) => submiBalnStake(values)}>
      {(...args) => {
        // const mutators = args[3]

        return (
          <div className={classes.section}>
            <StyledTitle size='md'>BALN Staking</StyledTitle>

            <StyledText size='sm'>
              Adjust the amount of BALN you want to stake from the multisig wallet.
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
                      value={balnStaked}
                      onChange={handleSliderChange}
                      max={balnMaxStacked}
                      getAriaValueText={valuetext}
                      aria-labelledby='discrete-slider-custom'
                      valueLabelDisplay='on'
                      valueLabelFormat={value => <div>{BALNFormatter(value)}</div>}
                      marks={stakingSliderMarks}
                    />
                  </Grid>
                  <Grid item>
                    <Input
                      disabled={checkboxMax}
                      className={classes.input}
                      value={balnStaked}
                      margin='dense'
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      inputProps={{
                        step: 1,
                        min: 0,
                        max: balnMaxStacked,
                        'aria-labelledby': 'discrete-slider-custom'
                      }}
                    />
                  </Grid>
                </Grid>
              </div>

            </Col>

            <StyledText size='xl'>
              BALN Staked : {balnStaked} / {balnMaxStacked} ({balnStakedPercent} %)
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

export default BALNStaking
