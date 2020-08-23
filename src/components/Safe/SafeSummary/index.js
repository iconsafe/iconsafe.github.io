import React from 'react'
import { connect } from 'react-redux'

import { getSafeAddress } from '@src/utils/route'

import { styles } from './style'
import { makeStyles } from '@material-ui/core/styles'
import CallMade from '@material-ui/icons/CallMade'
import CallReceived from '@material-ui/icons/CallReceived'
import classNames from 'classnames/bind'

import Block from '@components/core/Block'
import Row from '@components/core/Row'
import Identicon from '@components/core/Identicon'
import Heading from '@components/core/Heading'
import Paragraph from '@components/core/Paragraph'
import CopyBtn from '@components/core/CopyBtn'
import IconTrackerBtn from '@components/core/IconTrackerBtn'
import Button from '@components/core/Button'

const useStyles = makeStyles(styles)

const SafeSummary = () => {
  const getSafeName = () => {
    return 'MultiSig Safe'
  }

  const getSafeValue = () => {
    return 1000
  }

  const classes = useStyles(styles)

  const address = getSafeAddress()
  const granted = false
  const name = getSafeName()
  const formattedTotalBalance = getSafeValue()
  const currentCurrency = 'ICX'

  const onSendFunds = () => { }
  const onReceiveFunds = () => { }

  return (
    <Block className={classes.container} margin='xl'>
      <Row className={classes.userInfo}>
        <Identicon address={address} diameter={50} />
        <Block className={classes.name}>
          <Row>
            <Heading className={classes.nameText} color='primary' tag='h2'>
              {name}
              {!!formattedTotalBalance && !!currentCurrency && (
                <span className={classes.totalBalance}>
                  {' '}
                  | {formattedTotalBalance} {currentCurrency}
                </span>
              )}
            </Heading>
            {!granted && <Block className={classes.readonly}>Read Only</Block>}
          </Row>
          <Block className={classes.user} justify='center'>
            <Paragraph
              className={classes.address}
              color='disabled'
              noMargin
              size='md'
              data-testid='safe-address-heading'
            >
              {address}
            </Paragraph>
            <CopyBtn content={address} />
            <IconTrackerBtn type='address' value={address} />
          </Block>
        </Block>
      </Row>

      <Block className={classes.balance}>
        <Button
          className={classes.send}
          color='primary'
          disabled={!granted}
          onClick={() => onSendFunds()}
          size='small'
          variant='contained'
          testId='main-send-btn'
        >
          <CallMade
            alt='Send Transaction'
            className={classNames(classes.leftIcon, classes.iconSmall)}
            component={undefined}
          />
          Send
        </Button>
        <Button
          className={classes.receive}
          color='primary'
          onClick={onReceiveFunds()}
          size='small'
          variant='contained'
        >
          <CallReceived
            alt='Receive Transaction'
            className={classNames(classes.leftIcon, classes.iconSmall)}
            component={undefined}
          />
          Receive
        </Button>
      </Block>

    </Block>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SafeSummary)
