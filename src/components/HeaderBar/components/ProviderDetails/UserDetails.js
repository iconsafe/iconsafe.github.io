import { withStyles } from '@material-ui/core/styles'
import Dot from '@material-ui/icons/FiberManualRecord'
import classNames from 'classnames'
import React from 'react'
import Identicon from '@components/core/Identicon'

import CircleDot from '@components/HeaderBar/components/CircleDot'
import Spacer from '@components/core/Spacer'
import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Hairline from '@components/core/Hairline'
import Img from '@components/core/Img'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'
import { background, connected as connectedBg, lg, md, sm, warning, xs } from '@src/theme/variables'
import { upperFirst } from '@src/utils/css'
import CopyBtn from '@components/core/CopyBtn'
import IconTrackerBtn from '@components/core/IconTrackerBtn'

const dot = require('../../assets/dotRinkeby.svg')
const walletIcon = require('../../assets/wallet.svg')

const styles = () => ({
  container: {
    padding: `${md} 12px`,
    display: 'flex',
    flexDirection: 'column'
  },
  identicon: {
    justifyContent: 'center',
    padding: `0 ${md}`
  },
  user: {
    borderRadius: '3px',
    backgroundColor: background,
    margin: '0 auto',
    padding: '9px',
    lineHeight: 1
  },
  details: {
    padding: `0 ${md}`,
    height: '20px',
    alignItems: 'center'
  },
  address: {
    flexGrow: 1,
    textAlign: 'center',
    letterSpacing: '-0.5px',
    marginRight: sm
  },
  labels: {
    fontSize: '12px',
    letterSpacing: '0.5px'
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  disconnect: {
    padding: `${md} ${lg}`,
    '& button': {
      background: '#f02525'
    }
  },
  dashboard: {
    padding: `${md} ${lg} ${xs}`
  },
  dashboardText: {
    letterSpacing: '1px'
  },
  disconnectText: {
    letterSpacing: '1px'
  },
  logo: {
    margin: `0px ${xs}`
  },
  dot: {
    marginRight: xs,
    height: '15px',
    width: '15px'
  },
  warning: {
    color: warning
  },
  connected: {
    color: connectedBg
  }
})

const UserDetails = ({ classes, connected, network, onDisconnect, openDashboard, provider, userAddress }) => {
  const status = connected ? 'Connected' : 'Connection error'
  const color = connected ? 'primary' : 'warning'

  return (
    <>
      <Block className={classes.container}>
        <Row align='center' className={classes.identicon} margin='md'>
          {connected ? (
            <Identicon address={userAddress || 'random'} size='lg' />
          )
            : (
              <CircleDot circleSize={75} dotRight={25} dotSize={25} dotTop={50} hideDot keySize={30} mode='warning' />
            )}
        </Row>
        <Block className={classes.user} justify='center'>
          {userAddress ? (
            <>
              <Paragraph
                className={classes.address}
                color='disabled'
                noMargin
                size='md'
                data-testid='safe-address-heading'
              >
                {userAddress}
              </Paragraph>
              <CopyBtn content={userAddress} />
              <IconTrackerBtn type='address' value={userAddress} />
            </>
          )
            : (
              'Address not available'
            )}
        </Block>
      </Block>
      <Hairline margin='xs' />
      <Row className={classes.details}>
        <Paragraph align='right' className={classes.labels} noMargin>
          Status
        </Paragraph>
        <Spacer />
        <Dot className={classNames(classes.dot, connected ? classes.connected : classes.warning)} />
        <Paragraph align='right' className={classes.labels} color={color} noMargin weight='bolder'>
          {status}
        </Paragraph>
      </Row>
      <Hairline margin='xs' />
      <Row className={classes.details}>
        <Paragraph align='right' className={classes.labels} noMargin>
          Wallet
        </Paragraph>
        <Spacer />
        <Img alt='Wallet icon' className={classes.logo} height={14} src={walletIcon} />
        <Paragraph align='right' className={classes.labels} noMargin weight='bolder'>
          {upperFirst(provider)}
        </Paragraph>
      </Row>
      <Hairline margin='xs' />
      <Row className={classes.details}>
        <Paragraph align='right' className={classes.labels} noMargin>
          Network
        </Paragraph>
        <Spacer />
        <Img alt='Network' className={classes.logo} height={14} src={dot} />
        <Paragraph align='right' className={classes.labels} noMargin weight='bolder'>
          {upperFirst(network)}
        </Paragraph>
      </Row>
      <Hairline margin='xs' />
      {openDashboard && (
        <Row className={classes.dashboard}>
          <Button color='primary' fullWidth onClick={openDashboard} size='medium' variant='contained'>
            <Paragraph className={classes.dashboardText} color='white' noMargin size='md'>
              {upperFirst(provider)} Wallet
            </Paragraph>
          </Button>
        </Row>
      )}
      <Row className={classes.disconnect}>
        <Button
          color='primary'
          fullWidth
          onClick={onDisconnect}
          size='medium'
          variant='contained'
          data-testid='disconnect-btn'
        >
          <Paragraph className={classes.disconnectText} color='white' noMargin size='md'>
            Disconnect
          </Paragraph>
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles)(UserDetails)
