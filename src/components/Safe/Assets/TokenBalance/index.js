import { makeStyles } from '@material-ui/core/styles'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { styles } from './style'
import Block from '@components/core/Block'
import Chart from 'react-google-charts'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { convertTsToDate, getTokenDecimals, displayUnit } from '@src/utils/icon'
import { Loader, LoadingContainer } from '@components/ICON'

const useStyles = makeStyles(styles)

const TokenBalance = ({ token }) => {
  const classes = useStyles()
  const [data, setData] = useState(null)
  const safeAddress = useSelector((state) => state.safeAddress)
  const multisigBalances = useSelector((state) => state.multisigBalances)
  const msw = getMultiSigWalletAPI(safeAddress)

  useEffect(() => {
    msw.get_token_balance_history(token.token).then(history => {
      const result = history.reverse().map(entry => {
        const token = multisigBalances.filter(balance => balance.token === entry.token)[0]
        return [
          convertTsToDate(entry.timestamp),
          parseFloat(displayUnit(entry.balance, token.decimals))
        ]
      })

      result.unshift(['Date', token.symbol])
      setData(result)
    })
  }, [token, multisigBalances])

  return (
    <Block className={classes.expandedTxBlock}>
      {!data &&
        <LoadingContainer className={classes.loadingBalance}>
          <Loader size='md' />
        </LoadingContainer>}
      {data &&
        <Chart
          width='100%'
          height='300px'
          chartType='LineChart'
          loader={<div>Loading Chart</div>}
          data={data}
          options={{
            pointSize: 5,
            title: `${token.symbol} balance`,
            backgroundColor: 'transparent',
            hAxis: { title: 'Date', titleTextStyle: { color: '#333' } },
            vAxis: { minValue: 0 },
            chartArea: { width: '50%', height: '70%' }
          }}
        />}
    </Block>
  )
}

export default TokenBalance
