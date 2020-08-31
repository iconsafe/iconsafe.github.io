import React from 'react'
import { useSelector } from 'react-redux'
import { getSafeAddress } from '@src/utils/route'
import { isWalletOwner } from '@src/utils/msw'
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

const SafeHeader = () => {
  const walletConnected = useSelector((state) => state.walletConnected)
  const walletOwners = useSelector((state) => state.walletOwners)

  const getSafeName = () => {
    return 'ICONSafe'
  }

  const classes = useStyles(styles)

  const address = getSafeAddress()
  const granted = isWalletOwner(walletConnected, walletOwners)
  const name = getSafeName()

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
            <IconTrackerBtn value={address} />
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

export default SafeHeader
