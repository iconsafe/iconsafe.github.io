import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import TransactionBuilder from './TransactionBuilder'
import { styles } from './style'
import css from './index.module'
import Img from '@components/core/Img'
import Block from '@components/core/Block'
import Col from '@components/core/Col'
import Hairline from '@components/core/Hairline'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'
import { isWalletOwner } from '@src/utils/msw'
import { IconText, Loader, LoadingContainer } from '@components/ICON'

const INITIAL_STATE = {
  showRemoveSafe: false,
  menuOptionIndex: 1
}

const useStyles = makeStyles(styles)

const txBuilderImg = require('./assets/tx-builder.svg')
const iissImg = require('./assets/iiss.svg')

const Apps = () => {
  const classes = useStyles()
  const [state, setState] = useState(INITIAL_STATE)
  const walletConnected = useSelector((state) => state.walletConnected)
  const owners = useSelector((state) => state.walletOwners)
  const granted = isWalletOwner(walletConnected, owners)

  const handleChange = (menuOptionIndex) => () => {
    setState((prevState) => ({ ...prevState, menuOptionIndex }))
  }

  const { menuOptionIndex } = state

  return (
    <div className={css.root}>
      {!owners &&
        <LoadingContainer>
          <Loader size='md' />
        </LoadingContainer>}

      {owners &&
        <Block className={classes.root}>

          <Col className={classes.menuWrapper} layout='column'>
            <Block className={classes.menu}>

              {/* Transaction Builder */}
              <Row className={cn(classes.menuOption, menuOptionIndex === 1 && classes.active)} onClick={handleChange(1)}>
                <Img width={20} src={txBuilderImg} style={{ marginRight: '10px' }} /> Transaction Builder
              </Row>
              <Hairline className={classes.hairline} />

              <Row className={cn(classes.menuOption, menuOptionIndex === 2 && classes.active)} onClick={handleChange(2)}>
                <Img width={20} src={iissImg} style={{ marginRight: '10px' }} /> IISS
              </Row>
              <Hairline className={classes.hairline} />

            </Block>
          </Col>

          <Col className={classes.contents} layout='column'>
            <Block className={classes.container}>
              {menuOptionIndex === 1 && <TransactionBuilder />}
            </Block>
          </Col>

        </Block>}
    </div>
  )
}

export default Apps
