import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { styles } from './styles'
import TokenTransferDescription from '@components/Safe/Transactions/TransactionDetails/TokenTransferDescription'
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

const useStyles = makeStyles(styles)

export const IncomingTxDescription = ({ tx }) => {
  const classes = useStyles()
  const [openedTokenTransfers, setOpenedTokenTransfers] = React.useState(true)

  const handleClick = () => {
    setOpenedTokenTransfers(!openedTokenTransfers)
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
          {tx.tokens.length > 0 &&
            <ListItem button onClick={handleClick}>
              <ListItemIcon>
                <SwapHorizIcon />
              </ListItemIcon>
              <ListItemText primary='Token transfers' />
              {openedTokenTransfers ? <ExpandLess /> : <ExpandMore />}
            </ListItem>}

          <Collapse
            in={openedTokenTransfers} timeout='auto' unmountOnExit
          >
            {tx.tokens.map((token, index) => (
              <List
                key={`${tx.created_txhash}-${index}`}
                component='div' disablePadding
              >
                {token.transfers.map((transfer, index) => (
                  <ListItem
                    key={`${tx.created_txhash}-${token.symbol}-${index}`}
                    button className={classes.nested}
                  >
                    <TokenTransferDescription
                      incoming
                      amount={transfer.amount}
                      symbol={token.symbol}
                      decimals={token.decimals}
                      address={transfer.source}
                    />
                  </ListItem>
                ))}
              </List>
            ))}
          </Collapse>
        </List>
      </Paper>
    </Block>
  )
}
