import React, { useState } from 'react'
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
  { label: 'ASSETS', icon: <AccountBalanceWalletIcon />, disabled: false },
  { label: 'TRANSACTIONS', icon: <ImportExportIcon />, disabled: false },
  { label: 'APPS', icon: <AppsIcon />, disabled: false },
  { label: 'ADDRESS BOOK', icon: <PersonPinIcon />, disabled: false },
  { label: 'SETTINGS', icon: <SettingsIcon />, disabled: false }
]

const SafeTabChoser = ({ assets }) => {
  const [value, setValue] = useState(0)
  const classes = useStyles()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

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
        <Assets />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Transactions />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Apps />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <AddressBook />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Settings />
      </TabPanel>

    </div>
  )
}

export default SafeTabChoser
