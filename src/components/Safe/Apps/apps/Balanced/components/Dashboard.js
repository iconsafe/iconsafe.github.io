import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { styles } from './style'
import { makeStyles } from '@material-ui/core/styles'
import WidgetWrapper from '@components/Safe/Apps/components/WidgetWrapper'
import Hairline from '@components/core/Hairline'
import { ZERO } from '@src/utils/icon'

import BALNStaking from './BALNStaking'
import BALNClaimRewards from './BALNClaimRewards'

const useStyles = makeStyles(styles)

const Dashboard = ({ subTransactions, setSubTransactions }) => {
  const classes = useStyles()
  const [claimedReward, setClaimedReward] = useState(ZERO)

  return (
    <WidgetWrapper>

      <BALNClaimRewards
        subTransactions={subTransactions}
        setSubTransactions={setSubTransactions}
        setClaimedReward={setClaimedReward}
      />

      <Hairline className={classes.sectionSep} />

      <BALNStaking
        subTransactions={subTransactions}
        setSubTransactions={setSubTransactions}
        claimedReward={claimedReward}
      />

    </WidgetWrapper>
  )
}

export default Dashboard
