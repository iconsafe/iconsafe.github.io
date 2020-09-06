import React, { useState, useEffect } from 'react'
import styles from './index.module'
import TabPanel from '@components/core/TabPanel'
import Assets from '@components/Safe/Assets'
import Transactions from '@components/Safe/Transactions'
import Settings from '@components/Safe/Settings'
import Apps from '@components/Safe/Apps'
import AddressBook from '@components/Safe/AddressBook'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import SettingsIcon from '@material-ui/icons/Settings'
import PersonPinIcon from '@material-ui/icons/PersonPin'
import { makeStyles } from '@material-ui/core/styles'
import { turquoiseIcon } from '@src/theme/variables'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import AppsIcon from '@material-ui/icons/Apps'
import ImportExportIcon from '@material-ui/icons/ImportExport'
import { createStyles } from '@material-ui/core'
import { useRouteMatch, useLocation, useHistory } from 'react-router-dom'
import Link from '@material-ui/core/Link'

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
  { label: 'ASSETS', icon: <AccountBalanceWalletIcon />, disabled: false, value: '/assets' },
  { label: 'TRANSACTIONS', icon: <ImportExportIcon />, disabled: false, value: '/transactions' },
  { label: 'APPS', icon: <AppsIcon />, disabled: false, value: '/apps' },
  { label: 'ADDRESS BOOK', icon: <PersonPinIcon />, disabled: false, value: '/address-book' },
  { label: 'SETTINGS', icon: <SettingsIcon />, disabled: false, value: '/settings' }
]

const SafeTabChoser = ({ assets }) => {
  const classes = useStyles()
  const match = useRouteMatch()
  const location = useLocation()
  const history = useHistory()

  const selectedTab = tabs.map(t => `${match.url}${t.value}`).includes(location.pathname) ? location.pathname : `${match.url}/assets`
  const [value, setValue] = useState(selectedTab)

  const handleChange = (value) => {
    history.push(value)
  }

  useEffect(() => {
    setValue(location.pathname)
  }, [location])

  return (
    <div className={styles.root}>
      <AppBar elevation={0} position='static' style={{ background: 'transparent', boxShadow: 'none' }}>
        <Tabs
          value={value}
          onChange={(event, value) => handleChange(value)}
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
              value={`${match.url}${t.value}`}
            />
          ))}
        </Tabs>
      </AppBar>
      <div className={styles.tabBar} />

      <TabPanel value={value} index={`${match.url}${tabs[0].value}`}>
        <Assets />
      </TabPanel>
      <TabPanel value={value} index={`${match.url}${tabs[1].value}`}>
        <Transactions />
      </TabPanel>
      <TabPanel value={value} index={`${match.url}${tabs[2].value}`}>
        <Apps />
      </TabPanel>
      <TabPanel value={value} index={`${match.url}${tabs[3].value}`}>
        <AddressBook />
      </TabPanel>
      <TabPanel value={value} index={`${match.url}${tabs[4].value}`}>
        <Settings />
      </TabPanel>

    </div>
  )
}

export default SafeTabChoser
