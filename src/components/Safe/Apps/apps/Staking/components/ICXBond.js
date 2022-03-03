import React, { useState, useEffect } from 'react'
import { IconConverter } from 'icon-sdk-js'
import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { styles } from './style'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import Col from '@components/core/Col'
import { Alert, AlertTitle } from '@material-ui/lab'
import Button from '@components/core/Button'
import Input from '@material-ui/core/Input'
import { shuffle } from 'lodash-es'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { Text, Title } from '@components/ICON'
import GnoForm from '@components/core/GnoForm'
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

const ICXBond = ({
  subTransactions, setSubTransactions,
  selectedBonders, setSelectedBonders,
  sumVotesAndBonds
}) => {
  const classes = useStyles()
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [staked, setStaked] = useState(ZERO)
  const domainNames = useSelector((state) => state.domainNames)
  const [pRepOptions, setPRepOptions] = useState(null)
  const [preps, setPreps] = useState(null)

  const tooManyVotes = staked && selectedBonders ? IconConverter.toBigNumber(sumVotesAndBonds).gt(staked) : false
  const selectedMaxDelegates = selectedBonders.length === 100
  const multisigBalances = useSelector((state) => state.multisigBalances)

  useEffect(() => {
    if (domainNames) {
      // Preps
      msw.getPReps().then(pReps => {
        setPreps(pReps)
        const pRepOptions = pReps.map(pRep => ({
          value: pRep.address,
          label: `${pRep.name} (${pRep.country})`
        }))
        setPRepOptions(shuffle(pRepOptions))

        // Bonds
        msw.getBonds(domainNames.TRANSACTION_MANAGER_PROXY).then(bonds => {
          const formattedBonds = bonds.bonds.map(bond => {
            return {
              value: bond.address,
              label: pReps.find(prep => prep.address === bond.address).name,
              bond: msw.convertDecimalsToUnit(bond.value, 18)
            }
          })
          setSelectedBonders(formattedBonds)
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
    const formattedDelegation = selectedBonders.map(delegate => {
      return {
        type: 'TypedDict',
        value: JSON.stringify({
          address: { type: 'Address', value: delegate.value },
          value: { type: 'int', value: IconConverter.toHex(msw.convertUnitToDecimals(delegate.votes, ICX_TOKEN_DECIMALS)) }
        })
      }
    })

    const getPrepName = (pReps, address) => {
      const value = pReps?.find(prep => prep.address === address)
      return value ? value.name : address
    }

    const subtx = new SubOutgoingTransaction(SCORE_INSTALL_ADDRESS, 'setBond', [
      { name: 'bonds', type: 'List', value: JSON.stringify(formattedDelegation) }
    ], 0, `Update bond to ${selectedBonders.map(delegate => getPrepName(preps, delegate.value)).join(', ')}`
    )
    subTransactions.push(subtx)
    setSubTransactions([...subTransactions])
  }

  function handleSelectBonders (selectedPReps) {
    const newSelectedBonders = (selectedPReps || []).map(pRep => {
      const delegation = selectedBonders.find(delegation => delegation.value === pRep.value)
      const bondValue = delegation ? delegation.bond : ZERO
      return { ...pRep, bond: bondValue }
    })

    setSelectedBonders(newSelectedBonders)
  }

  function createBondChangeHandler (selectedDelegate, parseValue) {
    return event => {
      let bondValue = event.target.value
      if (parseValue) {
        bondValue = IconConverter.toBigNumber(event.target.value)
      }
      // debugger
      selectedDelegate.bond = parseValue && bondValue.isNaN() ? ZERO : bondValue

      const index = selectedBonders.findIndex(
        delegate => delegate.value === selectedDelegate.value
      )

      setSelectedBonders([
        ...selectedBonders.slice(0, index),
        selectedDelegate,
        ...selectedBonders.slice(index + 1)
      ])
    }
  }

  function createRemoveBondHandler (selectedDelegate) {
    return () => {
      const index = selectedBonders.findIndex(
        delegate => delegate.value === selectedDelegate.value
      )
      setSelectedBonders([
        ...selectedBonders.slice(0, index),
        ...selectedBonders.slice(index + 1)
      ])
    }
  }

  return (
    <GnoForm formMutators={{}} onSubmit={(values) => onSubmitAddress(values)}>
      {(...args) => {
        // const mutators = args[3]

        return (
          <div className={classes.section}>
            <StyledTitle size='md'>ICX Bond</StyledTitle>

            <StyledText size='sm'>
              Choose P-Rep candidates from the dropdown list then set how much of your staked ICX to bond to each.
            </StyledText>

            <Col style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

              <div className={classes.select}>
                <Select
                  id='selectedBonders'
                  name='selectedBonders'
                  options={pRepOptions}
                  value={selectedBonders}
                  onChange={handleSelectBonders}
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
              {selectedBonders.length > 0 && (
                <table className={classes.delegateTable}>
                  <thead>
                    <tr>
                      <th className={classes.prepname}>P-Rep candidate</th>
                      <th className={classes.prepvotes}>Bond</th>
                      <th className={classes.cancelx}>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBonders.map(selectedDelegate => (
                      <tr key={selectedDelegate.value}>
                        <td>{selectedDelegate.label}</td>
                        <td>
                          <Input
                            inputProps={{ className: classes.delegateInput }}
                            type='text'
                            value={selectedDelegate.bond}
                            onChange={createBondChangeHandler(selectedDelegate, false)}
                            onBlur={createBondChangeHandler(selectedDelegate, true)}
                          />
                        </td>
                        <td>
                          <Button
                            type='button'
                            onClick={createRemoveBondHandler(selectedDelegate)}
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
                <AlertTitle>{`${displayUnit(sumVotesAndBonds, ICX_TOKEN_DECIMALS)} / ${displayUnit(staked, ICX_TOKEN_DECIMALS)} votes`}</AlertTitle>
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
    </GnoForm>
  )
}

export default ICXBond
