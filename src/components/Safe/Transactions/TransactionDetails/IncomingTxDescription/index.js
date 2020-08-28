import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { styles } from './styles'
import TokenTransferDescription from '@components/Safe/Transactions/TransactionDetails/TokenTransferDescription'
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

const useStyles = makeStyles(styles)

export const IncomingTxDescription = ({ tx }) => {
  const classes = useStyles()
  const [openedTokenTransfers, setOpenedTokenTransfers] = React.useState(true)

  const handleClick = () => {
    setOpenedTokenTransfers(!openedTokenTransfers)
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
          <ListItem button onClick={handleClick}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary='Token transfers' />
            {openedTokenTransfers ? <ExpandLess /> : <ExpandMore />}
          </ListItem>}

        {tx.tokens.map((token, index) => (
          <Collapse
            key={`${tx.txhash}-${index}`}
            in={openedTokenTransfers} timeout='auto' unmountOnExit
          >
            <List component='div' disablePadding>
              <ListItem button className={classes.nested}>
                <TokenTransferDescription
                  key={`${tx.txhash}-${index}`}
                  incoming
                  amount={token.amount}
                  symbol={token.symbol}
                  decimals={token.decimals}
                  address={token.source}
                />
              </ListItem>
            </List>
          </Collapse>
        ))}
      </List>
    </Block>
  )
}
