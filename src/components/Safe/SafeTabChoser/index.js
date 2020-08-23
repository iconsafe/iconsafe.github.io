import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styles from './SafeTabChoser.module'

import TabPanel from '@components/core/TabPanel'
import Assets from '@components/Assets'

import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

import PhoneIcon from '@material-ui/icons/Phone'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PersonPinIcon from '@material-ui/icons/PersonPin'
import HelpIcon from '@material-ui/icons/Help'
import ShoppingBasket from '@material-ui/icons/ShoppingBasket'
import { makeStyles } from '@material-ui/core/styles'
import { turquoiseIcon } from '@src/theme/variables'

import { createStyles } from '@material-ui/core'
import { MultiSigWalletScore } from '@src/SCORE/MultiSigWalletScore'
import { getSafeAddress } from '@src/utils/route'
import { isTokenICX, displayBalance } from '@src/utils/icon'

export const inlineStyles = createStyles({
  root: {
    color: '#1c1c1c'
  },
  labelIcon: { minHeight: '10px' },
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    '& svg': {
      display: 'block',
      marginRight: '10px'
    }
  },
  selected: {
    color: turquoiseIcon
  },
  indicator: {
    backgroundColor: turquoiseIcon
  }
})

const useStyles = makeStyles(inlineStyles)

const tabs = [
  { label: 'ASSETS', icon: <PhoneIcon />, disabled: false },
  { label: 'TRANSACTIONS', icon: <ShoppingBasket />, disabled: false },
  { label: 'BALANCE HISTORY', icon: <FavoriteIcon />, disabled: false },
  { label: 'APPS', icon: <PersonPinIcon />, disabled: false },
  { label: 'ADDRESS BOOK', icon: <HelpIcon />, disabled: false },
  { label: 'SETTINGS', icon: <ShoppingBasket />, disabled: false }
]

const SafeTabChoser = ({ networkConnected }) => {
  const [value, setValue] = useState(0)
  const [assets, setAssets] = useState(null)
  const classes = useStyles()
  const safeWallet = getSafeAddress()

  const msw = new MultiSigWalletScore(networkConnected, safeWallet)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    const getAssetInformation = (token) => {
      if (isTokenICX(token)) {
        const promises = [msw.icxBalance(safeWallet)]
        return Promise.allSettled(promises).then(result => {
          result = result.map(item => item.value)
          console.log(result)
          return {
            asset: 'ICX',
            balance: displayBalance(result[0]),
            value: '? USD'
          }
        })
      } else {
        const promises = [msw.irc2Symbol(token), msw.irc2Balance(safeWallet, token)]

        return Promise.allSettled(promises).then(result => {
          result = result.map(item => item.value)
          return {
            asset: result[0],
            balance: displayBalance(result[1]),
            value: '? USD'
          }
        })
      }
    }

    msw.get_balance_trackers().then(trackers => {
      const promises = trackers.map(tracker => getAssetInformation(tracker))

      return Promise.allSettled(promises).then(result => {
        result = result.filter(item => item.status === 'fulfilled')
        result = result.map(item => item.value)
        setAssets(result)
      })
    })
  }, [safeWallet])

  return (
    <div className={styles.root}>
      <AppBar elevation={0} position='static' style={{ background: 'transparent', boxShadow: 'none' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant='scrollable'
          classes={{
            indicator: classes.indicator
          }}
        >
          {tabs.map(t => (
            <Tab
              classes={{
                root: classes.root,
                wrapper: classes.wrapper,
                labelIcon: classes.labelIcon,
                selected: classes.selected
              }}
              key={t.label}
              label={t.label}
              icon={t.icon}
              disabled={t.disabled}
            />
          ))}
        </Tabs>
      </AppBar>
      <div className={styles.tabBar} />

      <TabPanel value={value} index={0}>
        {assets && <Assets assets={assets} />}
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
      <TabPanel value={value} index={5}>
        Item Six
      </TabPanel>
      <TabPanel value={value} index={6}>
        Item Seven
      </TabPanel>

    </div>
  )
}

const mapStateToProps = state => {
  return {
    networkConnected: state.networkConnected
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SafeTabChoser)
