import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './style'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import Col from '@src/components/core/Col'
import Button from '@src/components/core/Button'
import { withSnackbar } from 'notistack'
import { Text, Title } from '@components/ICON'
import GnoForm from '@src/components/core/GnoForm'
import { displayUnit } from '@src/utils/icon'

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`

const StyledText = styled(Text)`
  margin-bottom: 15px;
`

const useStyles = makeStyles(styles)

const ISCOREClaim = ({ enqueueSnackbar }) => {
  const classes = useStyles()
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [availableSCORE, setAvailableSCORE] = useState(0)
  const domainNames = useSelector((state) => state.domainNames)
  const [intervalHandle, setIntervalHandle] = useState(null)

  const refreshIscore = () => {
    if (domainNames) {
      msw.queryIScore(domainNames.TRANSACTION_MANAGER_PROXY).then(({ estimatedICX }) => {
        setAvailableSCORE(parseFloat(displayUnit(estimatedICX, 18)).toFixed(5))
      })
    }
  }

  useEffect(() => {
    if (domainNames) {
      refreshIscore()

      if (intervalHandle) {
        clearInterval(intervalHandle)
      }

      const hInterval = setInterval(() => {
        refreshIscore()
      }, 1000 * 2)

      setIntervalHandle(hInterval)
    }
  }, [JSON.stringify(domainNames)])

  const onSubmitClaim = (values) => {
    msw.claim_iscore().then(({ iscore, icx }) => {
      const iscoreClaimed = parseFloat(displayUnit(iscore, 18)).toFixed(5)
      const icxClaimed = parseFloat(displayUnit(icx, 18)).toFixed(5)
      enqueueSnackbar(`${iscoreClaimed} I-Score have been converted to ${icxClaimed} ICX and added to your balance.`, {
        variant: 'success',
        autoHideDuration: 10000,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
      })
      refreshIscore()
    }).catch((error) => {
      enqueueSnackbar(`Something wrong happened when claiming your I-Score : ${error}`, {
        variant: 'error',
        autoHideDuration: 10000,
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' }
      })
    })
  }

  return (
    <GnoForm formMutators={{}} onSubmit={(values) => onSubmitClaim(values)}>
      {(...args) => {
        // const mutators = args[3]

        return (
          <div className={classes.section}>
            <StyledTitle size='md'>I-Score claim</StyledTitle>

            <StyledText size='sm'>
              Here you can convert your I-Score to ICX. Any wallet owner can claim I-Score without any confirmation from other wallet owners.
            </StyledText>

            <Col style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              {availableSCORE} ICX available
            </Col>

            {/* Submit */}
            <div style={{ height: '55px' }}>
              <Button
                className={classes.buttonSubmit}
                color='primary'
                type='submit'
                variant='contained'
              >
                Claim I-Score
              </Button>
            </div>
          </div>
        )
      }}
    </GnoForm>
  )
}

export default withSnackbar(ISCOREClaim)
