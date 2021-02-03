import React, { useState, useEffect } from 'react'
import { IconConverter } from 'icon-sdk-js'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './style'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import Col from '@src/components/core/Col'
import { Alert, AlertTitle } from '@material-ui/lab'
import Button from '@src/components/core/Button'
import Input from '@material-ui/core/Input'
import { shuffle } from 'lodash-es'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { Text, Title } from '@components/ICON'
import GnoForm from '@src/components/core/GnoForm'
import { SubOutgoingTransaction } from '@src/SCORE/MultiSigWalletScore'
import { SCORE_INSTALL_ADDRESS } from '@src/SCORE/Ancilia'
import { ZERO, ICX_TOKEN_ADDRESS, displayUnit, ICX_TOKEN_DECIMALS } from '@src/utils/icon'

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`

const StyledText = styled(Text)`
  margin-bottom: 15px;
`

const useStyles = makeStyles(styles)

const ICXStaking = ({
  subTransactions, setSubTransactions,
  selectedDelegates, setSelectedDelegates, sumVotes
}) => {
  const classes = useStyles()
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [staked, setStaked] = useState(ZERO)
  const domainNames = useSelector((state) => state.domainNames)
  const [pRepOptions, setPRepOptions] = useState(null)

  const tooManyVotes = staked && selectedDelegates ? sumVotes(selectedDelegates).gt(staked) : false
  const selectedMaxDelegates = selectedDelegates.length === 100
  const multisigBalances = useSelector((state) => state.multisigBalances)

  useEffect(() => {
    if (domainNames) {
      // Preps
      msw.getPReps().then(pReps => {
        const pRepOptions = pReps.map(pRep => ({
          value: pRep.address,
          label: `${pRep.name} (${pRep.country})`
        }))
        setPRepOptions(shuffle(pRepOptions))

        // Delegation
        msw.getDelegations(domainNames.TRANSACTION_MANAGER_PROXY).then(delegations => {
          const formattedDelegations = delegations.delegations.map(delegation => {
            return {
              value: delegation.address,
              label: pReps.find(prep => prep.address === delegation.address).name,
              votes: msw.convertDecimalsToUnit(delegation.value, 18)
            }
          })
          setSelectedDelegates(formattedDelegations)
        })
      })

      // Staked ICX
      if (multisigBalances) {
        const icxBalance = multisigBalances.filter(balance => balance.token === ICX_TOKEN_ADDRESS)[0]
        setStaked(icxBalance?.iiss?.staked)
      }
    }
  }, [JSON.stringify(domainNames), JSON.stringify(multisigBalances)])

  const onSubmitAddress = (values) => {
    const formattedDelegation = selectedDelegates.map(delegate => {
      return {
        type: 'TypedDict',
        value: JSON.stringify({
          address: { type: 'Address', value: delegate.value },
          value: { type: 'int', value: IconConverter.toHex(msw.convertUnitToDecimals(delegate.votes, ICX_TOKEN_DECIMALS)) }
        })
      }
    })

    const subtx = new SubOutgoingTransaction(SCORE_INSTALL_ADDRESS, 'setDelegation', [
      { name: 'delegations', type: 'List', value: JSON.stringify(formattedDelegation) }
    ], 0, 'Delegation description'
    )
    subTransactions.push(subtx)
    setSubTransactions([...subTransactions])
  }

  function handleSelectDelegates (selectedPReps) {
    const newSelectedDelegates = (selectedPReps || []).map(pRep => {
      const delegation = selectedDelegates.find(delegation => delegation.value === pRep.value)
      const votes = delegation ? delegation.votes : ZERO
      return { ...pRep, votes: votes }
    })
    setSelectedDelegates(newSelectedDelegates)
  }

  function createVotesChangeHandler (selectedDelegate, parseValue) {
    return event => {
      let votesValue = event.target.value
      if (parseValue) {
        votesValue = IconConverter.toBigNumber(event.target.value)
      }
      selectedDelegate.votes = parseValue && votesValue.isNaN() ? ZERO : votesValue

      const index = selectedDelegates.findIndex(
        delegate => delegate.value === selectedDelegate.value
      )

      setSelectedDelegates([
        ...selectedDelegates.slice(0, index),
        selectedDelegate,
        ...selectedDelegates.slice(index + 1)
      ])
    }
  }

  function createRemoveDelegateHandler (selectedDelegate) {
    return () => {
      const index = selectedDelegates.findIndex(
        delegate => delegate.value === selectedDelegate.value
      )
      setSelectedDelegates([
        ...selectedDelegates.slice(0, index),
        ...selectedDelegates.slice(index + 1)
      ])
    }
  }

  return (
    <GnoForm formMutators={{}} onSubmit={(values) => onSubmitAddress(values)}>
      {(...args) => {
        // const mutators = args[3]

        return (
          <div className={classes.section}>
            <StyledTitle size='md'>ICX Delegation</StyledTitle>

            <StyledText size='sm'>
              Choose P-Rep candidates from the dropdown list then set how much of your staked ICX to delegate to each.
            </StyledText>

            <Col style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

              <div className={classes.select}>
                <Select
                  id='selectedDelegates'
                  name='selectedDelegates'
                  options={pRepOptions}
                  value={selectedDelegates}
                  onChange={handleSelectDelegates}
                  isMulti
                  isClearable={false}
                  controlShouldRenderValue={false}
                  placeholder={
                    selectedMaxDelegates
                      ? 'Selected 10 P-Rep candidates'
                      : 'Find P-Rep candidates…'
                  }
                  isDisabled={selectedMaxDelegates}
                  className='text-lg'
                />
              </div>
            </Col>

            <Col className={classes.votes}>
              {selectedDelegates.length > 0 && (
                <table className={classes.delegateTable}>
                  <thead>
                    <tr>
                      <th className={classes.prepname}>P-Rep candidate</th>
                      <th className={classes.prepvotes}>Votes</th>
                      <th className={classes.cancelx}>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDelegates.map(selectedDelegate => (
                      <tr key={selectedDelegate.value}>
                        <td>{selectedDelegate.label}</td>
                        <td>
                          <Input
                            inputProps={{ className: classes.delegateInput }}
                            type='text'
                            value={selectedDelegate.votes}
                            onChange={createVotesChangeHandler(selectedDelegate, false)}
                            onBlur={createVotesChangeHandler(selectedDelegate, true)}
                          />
                        </td>
                        <td>
                          <Button
                            type='button'
                            onClick={createRemoveDelegateHandler(selectedDelegate)}
                            title='Remove delegation'
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Col>

            <Col className={classes.alertvotes}>
              <Alert severity={tooManyVotes ? 'error' : 'info'}>
                <AlertTitle>{`${displayUnit(sumVotes(selectedDelegates), ICX_TOKEN_DECIMALS)} / ${displayUnit(staked, ICX_TOKEN_DECIMALS)} votes`}</AlertTitle>
                used / available (staked ICX)
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
    </GnoForm >
  )
}

export default ICXStaking
