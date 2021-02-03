import React, { useState } from 'react'
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

const useStyles = makeStyles(styles)

const Dashboard = ({ subTransactions, setSubTransactions }) => {
  const classes = useStyles()
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)

  function sumVotes (delegates) {
    return delegates.reduce((sum, delegate) => {
      const votes = IconConverter.toBigNumber(msw.convertUnitToDecimals(delegate.votes, 18))
      return sum.plus(votes.isNaN() ? ZERO : votes)
    }, ZERO)
  }

  const [selectedDelegates, setSelectedDelegates] = useState([])
  const sumDelegates = sumVotes(selectedDelegates)

  return (
    <WidgetWrapper>

      <ISCOREClaim />

      <Hairline className={classes.sectionSep} />

      <ICXStaking
        subTransactions={subTransactions}
        setSubTransactions={setSubTransactions}
        sumDelegates={sumDelegates}
      />

      <Hairline className={classes.sectionSep} />

      <ICXDelegation
        subTransactions={subTransactions}
        setSubTransactions={setSubTransactions}
        selectedDelegates={selectedDelegates} setSelectedDelegates={setSelectedDelegates} sumVotes={sumVotes}
      />

    </WidgetWrapper>
  )
}

export default Dashboard
