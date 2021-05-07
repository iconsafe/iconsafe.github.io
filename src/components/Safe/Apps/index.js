import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import Balanced from './apps/Balanced'
import IRC2Transfer from './apps/IRC2Transfer'
import ICXTransfer from './apps/ICXTransfer'
import TxBuilder from './apps/TxBuilder'
import Staking from './apps/Staking'
import { styles } from './style'
import css from './index.module'
import Img from '@components/core/Img'
import Block from '@components/core/Block'
import Col from '@components/core/Col'
import Hairline from '@components/core/Hairline'
import Row from '@components/core/Row'
import { FixedIcon, Loader, Title, LoadingContainer } from '@components/ICON'
import styled from 'styled-components'
import { getMultiSigWalletAPI } from '@src/utils/msw'
import { TransactionsOverview } from './components/TransactionsOverview'
import { convertTransactionToDisplay } from '@components/Safe/Transactions'
import { OutgoingTransaction } from '@src/SCORE/MultiSigWalletScore'

const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const useStyles = makeStyles(styles)

const txBuilderImg = require('./assets/tx-builder.svg')
const iissImg = require('./assets/iiss.svg')
const irc2Img = require('./assets/irc2.svg')
const icx = require('./assets/icon-iconex.svg')
const balanced = require('./assets/baln.png')

const APPS = {
  ICX_TRANSFER: { index: 1, title: 'ICX Transfer', img: icx },
  ICX_STACKING: { index: 2, title: 'ICX Staking', img: iissImg },
  IRC2_TRANSFER: { index: 3, title: 'IRC2 Transfer', img: irc2Img },
  BALANCED: { index: 4, title: 'Balanced', img: balanced },
  // Keep it last
  TX_BUILDER: { index: 5, title: 'Transaction Builder', img: txBuilderImg },
}

const INITIAL_STATE = {
  showRemoveSafe: false,
  menuOptionIndex: APPS.ICX_TRANSFER.index
}

const Apps = () => {
  const classes = useStyles()
  const [state, setState] = useState(INITIAL_STATE)
  const owners = useSelector((state) => state.walletOwners)
  const granted = useSelector((state) => state.granted)
  const [subTransactions, setSubTransactions] = useState([])
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [outTx, setOutTx] = useState(null)
  const [tokenCache, setTokenCache] = useState([])

  const handleChange = (menuOptionIndex) => () => {
    setState((prevState) => ({ ...prevState, menuOptionIndex }))
  }

  const { menuOptionIndex } = state

  const clearTransaction = () => {
    setSubTransactions([])
    setOutTx(null)
  }

  const onSubmitTransactions = () => {
    msw.submit_transaction(subTransactions.map(tx => tx.serialize())).then(tx => {
      clearTransaction()
    })
  }

  useEffect(() => {
    if (subTransactions.length > 0) {
      convertTransactionToDisplay(OutgoingTransaction.create([], [], 'WAITING', subTransactions, 0, 0),
        safeAddress, tokenCache)
        .then(tx => {
          setOutTx(tx)
        })
    } else {
      setOutTx(null)
    }
  }, [JSON.stringify(subTransactions)])

  const renderApp = (menuOptionIndex) => {
    switch (menuOptionIndex) {
      case APPS.ICX_TRANSFER.index:
        return (
          <ICXTransfer
            subTransactions={subTransactions}
            setSubTransactions={setSubTransactions}
          />
        )
      case APPS.ICX_STACKING.index:
        return (
          <Staking
            subTransactions={subTransactions}
            setSubTransactions={setSubTransactions}
          />
        )
      case APPS.IRC2_TRANSFER.index:
        return (
          <IRC2Transfer
            subTransactions={subTransactions}
            setSubTransactions={setSubTransactions}
          />
        )
      case APPS.BALANCED.index:
        return (
          <Balanced
            subTransactions={subTransactions}
            setSubTransactions={setSubTransactions}
          />
        )
      case APPS.TX_BUILDER.index:
        return (
          <TxBuilder
            subTransactions={subTransactions}
            setSubTransactions={setSubTransactions}
          />
        )
    }
  }

  return (
    <div className={css.root}>
      {!owners &&
        <LoadingContainer>
          <Loader size='md' />
        </LoadingContainer>}

      {owners &&
        <Paper>
          <Block className={classes.root}>

            <Col className={classes.menuWrapper} layout='column'>
              <Block className={classes.menu}>

                {/* ICX Transfer */}
                {Object.entries(APPS).map(([key, value]) => (
                  <React.Fragment key={key}>
                    <Row className={cn(classes.menuOption, menuOptionIndex === value.index && classes.active)} onClick={handleChange(value.index)}>
                      <Img width={20} src={value.img} style={{ marginRight: '10px' }} /> {value.title}
                    </Row>
                    <Hairline className={classes.hairline} />
                  </React.Fragment>
                ))}

              </Block>
            </Col>

            <Col className={classes.contents} layout='column'>
              <Block className={classes.container}>
                {!granted &&
                  <Centered style={{ height: '476px' }}>
                    <FixedIcon type='notOwner' />
                    <Title size='xs'>To use apps, you must be an owner of this Safe</Title>
                  </Centered>}
                {granted &&

                  <Block className={classes.appContainer}>
                    <Col className={classes.appBuilder}>
                      {renderApp(menuOptionIndex)}
                    </Col>

                    <Col className={classes.appTxOverview}>
                      <TransactionsOverview outTx={outTx} subTransactions={subTransactions} onSubmitTransactions={onSubmitTransactions} clearTransaction={clearTransaction} />
                    </Col>
                  </Block>}

              </Block>
            </Col>

          </Block>
        </Paper>}
    </div>
  )
}

export default Apps
