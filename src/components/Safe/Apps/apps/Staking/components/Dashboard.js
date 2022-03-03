import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { styles } from './style'
import { makeStyles } from '@material-ui/core/styles'
import WidgetWrapper from '@components/Safe/Apps/components/WidgetWrapper'
import Hairline from '@components/core/Hairline'
import { IconConverter } from 'icon-sdk-js'
import { ZERO } from '@src/utils/icon'

import ICXStaking from './ICXStaking'
import ICXDelegation from './ICXDelegation'
import ISCOREClaim from './ISCOREClaim'
import ICXBond from './ICXBond'

const useStyles = makeStyles(styles)

const Dashboard = ({ subTransactions, setSubTransactions }) => {
  const classes = useStyles()
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)

  function calculateVotesAndBonds () {
    const sumDelegates = selectedDelegates.reduce((sum, delegate) => {
      const votes = IconConverter.toBigNumber(msw.convertUnitToDecimals(delegate.votes, 18))
      return sum.plus(votes.isNaN() ? ZERO : votes)
    }, ZERO)

    const sumBonds = selectedBonders.reduce((sum, delegate) => {
      const bond = IconConverter.toBigNumber(msw.convertUnitToDecimals(delegate.bond, 18))
      return sum.plus(bond.isNaN() ? ZERO : bond)
    }, ZERO)

    setSumVotesAndBonds(IconConverter.toBigNumber(sumDelegates).plus(IconConverter.toBigNumber(sumBonds)))
  }

  const [sumVotesAndBonds, setSumVotesAndBonds] = useState(0)
  const [selectedDelegates, setSelectedDelegates] = useState([])
  const [selectedBonders, setSelectedBonders] = useState([])

  useEffect(() => {
    calculateVotesAndBonds()
  }, [selectedDelegates, selectedBonders])

  return (
    <WidgetWrapper>

      <ISCOREClaim />

      <Hairline className={classes.sectionSep} />

      <ICXStaking
        subTransactions={subTransactions}
        setSubTransactions={setSubTransactions}
        sumVotesAndBonds={sumVotesAndBonds}
      />

      <Hairline className={classes.sectionSep} />

      <ICXDelegation
        subTransactions={subTransactions}
        setSubTransactions={setSubTransactions}
        selectedDelegates={selectedDelegates}
        setSelectedDelegates={setSelectedDelegates}
        sumVotesAndBonds={sumVotesAndBonds}
      />

      <Hairline className={classes.sectionSep} />

      <ICXBond
        subTransactions={subTransactions}
        setSubTransactions={setSubTransactions}
        selectedBonders={selectedBonders}
        setSelectedBonders={setSelectedBonders}
        sumVotesAndBonds={sumVotesAndBonds}
      />

    </WidgetWrapper>
  )
}

export default Dashboard
