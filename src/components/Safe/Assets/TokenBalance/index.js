import { makeStyles } from '@material-ui/core/styles'
import React, { useState, useEffect } from 'react'
import { styles } from './style'
import Block from '@components/core/Block'
import Chart from 'react-google-charts'
import { getSafeAddress } from '@src/utils/route'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { convertTsToDate, getTokenDecimals, displayUnit } from '@src/utils/icon'

const useStyles = makeStyles(styles)

const TokenBalance = ({ token }) => {
  const classes = useStyles()
  const [data, setData] = useState(null)
  const safeAddress = getSafeAddress()
  const msw = getMultiSigWalletAPI(safeAddress)

  useEffect(() => {
    msw.get_token_balance_history(token.token).then(history => {
      const promises = history.reverse().map(entry => {
        return getTokenDecimals(entry.token).then(decimals => {
          return [
            convertTsToDate(entry.timestamp),
            parseFloat(displayUnit(entry.balance, decimals))
          ]
        })
      })

      Promise.all(promises).then(result => {
        result.unshift(['Date', token.symbol])
        setData(result)
      })
    })
  }, [token])

  return (
    <>
      {data &&
        <Block className={classes.expandedTxBlock}>
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
          />
        </Block>}
    </>
  )
}

export default TokenBalance
