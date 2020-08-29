import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { styles } from './styles'
import TokenTransferDescription from '@components/Safe/Transactions/TransactionDetails/TokenTransferDescription'
import RawMethodCallDescription from '@components/Safe/Transactions/TransactionDetails/RawMethodCallDescription'
import Block from '@src/components/core/Block'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Collapse from '@material-ui/core/Collapse'
import ViewListIcon from '@material-ui/icons/ViewList'

const useStyles = makeStyles(styles)

export const OutgoingTxDescription = ({ tx }) => {
  const classes = useStyles()
  const [openedTokenTransfers, setOpenedTokenTransfers] = React.useState(true)
  const [openedRawMethodCalls, setOpenedRawMethodCalls] = React.useState(false)

  const handleClickTokenTransfers = () => {
    setOpenedTokenTransfers(!openedTokenTransfers)
  }

  const handleClickRawMethodCalls = () => {
    setOpenedRawMethodCalls(!openedRawMethodCalls)
  }

  return (
    <Block className={classes.txDataContainer}>
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
        {tx.tokens.length > 0 &&
          <ListItem button onClick={handleClickTokenTransfers}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary='Token transfers' />
            {openedTokenTransfers ? <ExpandLess /> : <ExpandMore />}
          </ListItem>}

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

        {tx.subTx.length > 0 &&
          <ListItem button onClick={handleClickRawMethodCalls}>
            <ListItemIcon>
              <ViewListIcon />
            </ListItemIcon>
            <ListItemText primary='Raw method calls' />
            {openedRawMethodCalls ? <ExpandLess /> : <ExpandMore />}
          </ListItem>}

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
      </List>
    </Block>
  )
}
