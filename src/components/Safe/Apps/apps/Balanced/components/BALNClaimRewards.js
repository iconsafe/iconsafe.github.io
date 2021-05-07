import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './style'
import { useSelector } from 'react-redux'
import { getBalancedAPI } from '@src/utils/balanced'
import Col from '@components/core/Col'
import Button from '@components/core/Button'
import { withSnackbar } from 'notistack'
import { Text, Title } from '@components/ICON'
import GnoForm from '@components/core/GnoForm'
import { displayUnit } from '@src/utils/icon'
import { BALANCED_SCORES } from '@src/SCORE/Balanced'
import { SubOutgoingTransaction } from '@src/SCORE/MultiSigWalletScore'

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`

const StyledText = styled(Text)`
  margin-bottom: 15px;
`

const useStyles = makeStyles(styles)

const BALNClaimRewards = ({ subTransactions, setSubTransactions }) => {
  const classes = useStyles()
  const balanced = getBalancedAPI()
  const [availableReward, setAvailableReward] = useState(0)
  const [intervalHandle, setIntervalHandle] = useState(null)
  const domainNames = useSelector((state) => state.domainNames)

  const refreshRewards = () => {
    if (domainNames) {
      balanced.getBalnHolding(domainNames.TRANSACTION_MANAGER_PROXY).then(reward => {
        setAvailableReward(parseFloat(displayUnit(reward, 18)).toFixed(5))
      })
    }
  }

  useEffect(() => {
    if (domainNames) {
      refreshRewards()

      if (intervalHandle) {
        clearInterval(intervalHandle)
      }

      const hInterval = setInterval(() => {
        refreshRewards()
      }, 1000 * 2)

      setIntervalHandle(hInterval)
    }
  }, [JSON.stringify(domainNames)])

  const onSubmitClaim = (values) => {
    const subtx = new SubOutgoingTransaction(BALANCED_SCORES['rewards'], 'claimRewards', [], 0, `Claim ${availableReward} BALN`
    )
    subTransactions.push(subtx)
    setSubTransactions([...subTransactions])
  }

  return (
    <GnoForm formMutators={{}} onSubmit={(values) => onSubmitClaim(values)}>
      {(...args) => {
        // const mutators = args[3]

        return (
          <div className={classes.section}>
            <StyledTitle size='md'>BALN Rewards claim</StyledTitle>

            <StyledText size='sm'>
              Here you can claim your BALN rewards available.
            </StyledText>

            <Col style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              {availableReward} BALN available
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

export default withSnackbar(BALNClaimRewards)
