import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState, useEffect } from 'react'
import { styles } from './styles'
import TokenTransferDescription from '@components/Safe/Transactions/TransactionDetails/TokenTransferDescription'
import Block from '@components/core/Block'
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
import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import Span from '@components/core/Span'
import Bold from '@components/core/Bold'
import { displayUnit } from '@src/utils/icon'
import Link from '@components/core/Link'

const useStyles = makeStyles(styles)

const ClaimIScoreTx = ({ tx }) => {
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [content, setContent] = useState('Loading...')
  const classes = useStyles()

  useEffect(() => {
    getContent().then(result => {
      setContent(result)
    })
  }, [])

  const getContent = async () => {
    return (
      <div className={classes.content}>
        <Link target='_blank' href={msw.getTrackerEndpoint() + "/address/" + tx.claimer.address}> {tx.claimer.name} </Link>
          has claimed <Span className={classes.cyanText}> <Bold>{displayUnit(tx.iscore, 18)} I-Score</Bold></Span>
      </div>
    )
  }

  return (
    <Block className={classes.container}>
      {content}
    </Block>
  )
}


export const ClaimIScoreTxDescription = ({ tx }) => {
  const classes = useStyles()
  const [openedTokenTransfers, setOpenedTokenTransfers] = React.useState(true)

  const handleClick = () => {
    setOpenedTokenTransfers(!openedTokenTransfers)
  }

  const getTokenTransfers = () => {
    return (
      <>
        <ListItem button onClick={handleClick}>
          <ListItemIcon style={{ marginRight: '5px' }}>
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
              key={`${tx.created_txhash}-${index}`}
              component='div' disablePadding
            >
              {token.transfers.map((transfer, index) => (
                <ListItem
                  key={`${tx.created_txhash}-${token.symbol}-${index}`}
                  className={classes.nested}
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
      </>)
  }

  const getClaimIScoreOperation = () => {
    return (
      <>
        <ListItem button onClick={handleClick}>
          <ListItemIcon style={{ marginRight: '5px' }}>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary='I-Score Claim operations' />
          {openedTokenTransfers ? <ExpandLess /> : <ExpandMore />}
        </ListItem>

        <Collapse in={openedTokenTransfers} timeout='auto' unmountOnExit>
          <List
            component='div'
            disablePadding
          >
            <ListItem
              key={`${tx.created_txhash}`}
              className={classes.nested}
            >
              <ClaimIScoreTx tx={tx} />
            </ListItem>
          </List>
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
          {getClaimIScoreOperation()}
          {tx.tokens.length > 0 && getTokenTransfers()}
        </List>
      </Paper>
    </Block>
  )
}
