import { makeStyles } from '@material-ui/core/styles'
import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { styles } from './style'
import Block from '@components/core/Block'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { displayUnit, ICX_TOKEN_ADDRESS } from '@src/utils/icon'
import { createChart } from 'lightweight-charts'
import ICXTokenBalanceDetails from './ICXTokenBalanceDetails'

const useStyles = makeStyles(styles)

const TokenBalance = ({ token }) => {
  const classes = useStyles()
  const [data, setData] = useState(null)
  const safeAddress = useSelector((state) => state.safeAddress)
  const multisigBalances = useSelector((state) => state.multisigBalances)
  const msw = getMultiSigWalletAPI(safeAddress)
  const chartRef = useRef()
  const containerRef = useRef()
  const [balanceChart, setBalanceChart] = useState(null)
  const [balanceAreaSeries, setBalanceAreaSeries] = useState(null)

  useEffect(() => {
    msw.get_token_balance_history(token.token).then(history => {
      const result = history.reverse().map(entry => {
        const token = multisigBalances.filter(balance => balance.token === entry.token)[0]
        return [
          parseInt(entry.timestamp) / 1000 / 1000,
          parseFloat(displayUnit(entry.balance, token.decimals))
        ]
      })

      setData(result)
    })
  }, [token, JSON.stringify(multisigBalances)])

  useEffect(() => {
    if (data) {
      let chart = balanceChart
      let areaSeries = balanceAreaSeries
      if (!chart) {
        const chartWidth = containerRef.current.clientWidth

        chart = createChart(chartRef.current, {
          width: chartWidth,
          height: 300,
          rightPriceScale: {
            borderVisible: false
          },
          timeScale: {
            borderVisible: false
          }
        })
        areaSeries = chart.addAreaSeries()

        const theme = {
          chart: {
            layout: {
              backgroundColor: '#fafaf8',
              lineColor: '#2fd5c9',
              textColor: '#333333'
            },
            watermark: {
              color: 'rgba(0, 0, 0, 0)'
            },
            crosshair: {
              color: '#758696'
            },
            grid: {
              vertLines: {
                visible: false
              },
              horzLines: {
                visible: false
              }
            }
          },
          series: {
            topColor: 'rgba(50, 184, 187, 0.56)',
            bottomColor: 'rgba(50, 184, 187, 0.04)',
            lineColor: 'rgba(50, 184, 187, 1)',
            lineWidth: 3
          }
        }

        areaSeries.applyOptions(theme.series)
        chart.applyOptions(theme.chart)

        setBalanceChart(chart)
        setBalanceAreaSeries(areaSeries)
      }

      areaSeries.setData(data.map(entry => ({ time: entry[0], value: entry[1] })))
      chart.timeScale().fitContent()
    }
  }, [JSON.stringify(data)])

  return (
    <div ref={containerRef}>
      <Block className={classes.expandedTxBlock}>
        {token == ICX_TOKEN_ADDRESS && <ICXTokenBalanceDetails />}
        <div ref={chartRef} />
      </Block>
    </div>
  )
}

export default TokenBalance
