import { ButtonLink, IconText } from '@components/ICON'
import Badge from '@material-ui/core/Badge'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

// import Advanced from './Advanced'
// import { RemoveSafeModal } from './RemoveSafeModal'
// import RemoveSafeIcon from './assets/icons/bin.svg'
import ManageOwners from './ManageOwners'
import SafeDetails from './SafeDetails'
import ThresholdSettings from './ThresholdSettings'
import { styles } from './style'

// import Loader from '@components/Loader'
import Block from '@components/core/Block'

import Col from '@components/core/Col'
import Hairline from '@components/core/Hairline'
import Img from '@components/core/Img'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'
import Span from '@components/core/Span'
import { isWalletOwner } from '@src/utils/msw'

const INITIAL_STATE = {
  showRemoveSafe: false,
  menuOptionIndex: 1
}

const useStyles = makeStyles(styles)

const Settings = () => {
  const classes = useStyles()
  const [state, setState] = useState(INITIAL_STATE)
  const walletConnected = useSelector((state) => state.walletConnected)
  const owners = useSelector((state) => state.walletOwners)
  const granted = isWalletOwner(walletConnected, owners)

  const handleChange = (menuOptionIndex) => () => {
    setState((prevState) => ({ ...prevState, menuOptionIndex }))
  }

  const onShow = (action) => () => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: true }))
  }

  const onHide = (action) => () => {
    setState((prevState) => ({ ...prevState, [`show${action}`]: false }))
  }

  const { menuOptionIndex, showRemoveSafe } = state

  return owners &&
    <>
      <Block className={classes.root}>
        <Col className={classes.menuWrapper} layout='column'>
          <Block className={classes.menu}>
            <Row className={cn(classes.menuOption, menuOptionIndex === 1 && classes.active)} onClick={handleChange(1)}>
              <IconText
                iconSize='sm'
                textSize='xl'
                iconType='info'
                text='Safe Details'
                color={menuOptionIndex === 1 ? 'primary' : 'secondary'}
              />
            </Row>
            <Hairline className={classes.hairline} />
            <Row
              className={cn(classes.menuOption, menuOptionIndex === 2 && classes.active)}
              onClick={handleChange(2)}
            >
              <IconText
                iconSize='sm'
                textSize='xl'
                iconType='owners'
                text='Owners'
                color={menuOptionIndex === 2 ? 'primary' : 'secondary'}
              />
              <Paragraph className={classes.counter} size='xs'>
                {owners.length}
              </Paragraph>
            </Row>
            <Hairline className={classes.hairline} />
            <Row className={cn(classes.menuOption, menuOptionIndex === 3 && classes.active)} onClick={handleChange(3)}>
              <IconText
                iconSize='sm'
                textSize='xl'
                iconType='requiredConfirmations'
                text='Policies'
                color={menuOptionIndex === 3 ? 'primary' : 'secondary'}
              />
            </Row>
            <Hairline className={classes.hairline} />
            {/* <Row className={cn(classes.menuOption, menuOptionIndex === 4 && classes.active)} onClick={handleChange(4)}>
              <IconText
                iconSize='sm'
                textSize='xl'
                iconType='settingsTool'
                text='Advanced'
                color={menuOptionIndex === 4 ? 'primary' : 'secondary'}
              />
            </Row>
            <Hairline className={classes.hairline} /> */}
          </Block>
        </Col>
        <Col className={classes.contents} layout='column'>
          <Block className={classes.container}>
            {menuOptionIndex === 1 && <SafeDetails />}
            {menuOptionIndex === 2 && <ManageOwners granted={granted} owners={owners} />}
            {menuOptionIndex === 3 && <ThresholdSettings />}
            {/* {menuOptionIndex === 4 && <Advanced />} */}
          </Block>
        </Col>
      </Block>
    </>
}

export default Settings
