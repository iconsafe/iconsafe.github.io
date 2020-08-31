import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { styles } from './styles'
import WalletOperationDescription from '@components/Safe/Transactions/TransactionDetails/WalletOperationDescription'
import TokenTransferDescription from '@components/Safe/Transactions/TransactionDetails/TokenTransferDescription'
import RawMethodCallDescription from '@components/Safe/Transactions/TransactionDetails/RawMethodCallDescription'
import Block from '@src/components/core/Block'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import SwapHorizIcon from '@material-ui/icons/SwapHoriz'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import ViewListIcon from '@material-ui/icons/ViewList'
import SettingsIcon from '@material-ui/icons/Settings'

const useStyles = makeStyles(styles)

export const OutgoingTxDescription = ({ tx }) => {
  const classes = useStyles()
  const [openedTokenTransfers, setOpenedTokenTransfers] = useState(true)
  const [openedSafeOperations, setOpenedSafeOperations] = useState(true)
  const [openedRawMethodCalls, setOpenedRawMethodCalls] = useState(false)

  const handleClickTokenTransfers = () => {
    setOpenedTokenTransfers(!openedTokenTransfers)
  }

  const handleClickRawMethodCalls = () => {
    setOpenedRawMethodCalls(!openedRawMethodCalls)
  }

  const handleClickSafeOperations = () => {
    setOpenedSafeOperations(!openedSafeOperations)
  }

  const getSubTx = () => {
    return (
      <>
        <ListItem button onClick={handleClickRawMethodCalls}>
          <ListItemIcon>
            <ViewListIcon />
          </ListItemIcon>
          <ListItemText primary='Raw method calls' />
          {openedRawMethodCalls ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse
          in={openedRawMethodCalls} timeout='auto' unmountOnExit
        >
          <List
            component='div'
            disablePadding
          >
            {tx.subTx.map((subtx, index) => (
              <ListItem
                key={`${tx.created_txhash}-${index}`}
                button className={classes.nested}
              >
                Transaction N° {index + 1}
                <RawMethodCallDescription
                  amount={subtx.amount}
                  params={subtx.params}
                  description={subtx.description}
                  methodName={subtx.method_name}
                  address={subtx.destination}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </>
    )
  }

  const getSafeOperations = () => {
    return (
      <>
        <ListItem button onClick={handleClickSafeOperations}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary='Safe Settings' />
          {openedSafeOperations ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse
          in={openedSafeOperations} timeout='auto' unmountOnExit
        >
          <List
            component='div'
            disablePadding
          >
            {tx.safeOperations.map((subtx, index) => (
              <ListItem
                key={`${tx.created_txhash}-${index}`}
                button className={classes.nested}
              >
                <WalletOperationDescription tx={subtx} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </>
    )
  }

  const getTokenTransfers = () => {
    return (
      <>
        <ListItem button onClick={handleClickTokenTransfers}>
          <ListItemIcon>
            <SwapHorizIcon />
          </ListItemIcon>
          <ListItemText primary='Token transfers' />
          {openedTokenTransfers ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse
          in={openedTokenTransfers} timeout='auto' unmountOnExit
        >
          {tx.tokens.map((token, index) => (
            <List
              key={`${tx.created_txhash}-${index}`} component='div' disablePadding
            >
              {token.transfers.map((transfer, index) => (
                <ListItem
                  key={`${tx.created_txhash}-${token.symbol}-${index}`}
                  button className={classes.nested}
                >
                  <TokenTransferDescription
                    incoming={false}
                    amount={transfer.amount}
                    symbol={token.symbol}
                    decimals={token.decimals}
                    address={transfer.destination}
                  />
                </ListItem>
              ))}
            </List>
          ))}
        </Collapse>
      </>
    )
  }

  return (
    <Block className={classes.txDataContainer}>
      <Paper style={{ overflow: 'auto' }}>
        <List
          component='nav'
          aria-labelledby='nested-list-subheader'
          subheader={
            <ListSubheader component='div' id='nested-list-subheader'>
              This transaction executes the following operations :
            </ListSubheader>
          }
          className={classes.root}
        >
          {tx.tokens.length > 0 && getTokenTransfers()}
          {tx.safeOperations.length > 0 && getSafeOperations()}

          {tx.subTx.length > 0 && getSubTx()}
        </List>
      </Paper>
    </Block>
  )
}
