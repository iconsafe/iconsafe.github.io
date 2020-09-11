import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import { useSelector } from 'react-redux'
import TxBuilder from './apps/TxBuilder'
import { styles } from './style'
import css from './index.module'
import Img from '@components/core/Img'
import Block from '@components/core/Block'
import Col from '@components/core/Col'
import Hairline from '@components/core/Hairline'
import Row from '@components/core/Row'
import { FixedIcon, Loader, Title, LoadingContainer } from '@components/ICON'
import styled from 'styled-components'

const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

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
  const owners = useSelector((state) => state.walletOwners)
  const granted = useSelector((state) => state.granted)

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

              {/* IISS */}
              <Row className={cn(classes.menuOption, menuOptionIndex === 2 && classes.active)} onClick={handleChange(2)}>
                <Img width={20} src={iissImg} style={{ marginRight: '10px' }} /> IISS
              </Row>
              <Hairline className={classes.hairline} />

            </Block>
          </Col>

          <Col className={classes.contents} layout='column'>
            <Block className={classes.container}>
              {!granted &&
                <Centered style={{ height: '476px' }}>
                  <FixedIcon type='notOwner' />
                  <Title size='xs'>To use apps, you must be an owner of this Safe</Title>
                </Centered>}
              {granted && menuOptionIndex === 1 && <TxBuilder />}
            </Block>
          </Col>

        </Block>}
    </div>
  )
}

export default Apps
