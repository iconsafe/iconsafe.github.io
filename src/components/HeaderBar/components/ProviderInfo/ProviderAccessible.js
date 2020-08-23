import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ICONHashInfo, Text } from '@components/ICON/'

import NetworkLabel from '../NetworkLabel'
import CircleDot from '@components/HeaderBar/components/CircleDot'
import Col from '@components/core/Col'
import Paragraph from '@components/core/Paragraph'
import WalletIcon from '../WalletIcon'
import { connected as connectedBg, screenSm, sm } from '@src/theme/variables'

const useStyles = makeStyles({
  network: {
    fontFamily: 'Averta, sans-serif'
  },
  networkLabel: {
    '& div': {
      paddingRight: sm,
      paddingLeft: sm
    }
  },
  identicon: {
    display: 'none',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block'
    }
  },
  dot: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    color: connectedBg,
    display: 'none',
    height: '15px',
    position: 'relative',
    right: '10px',
    top: '12px',
    width: '15px',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block'
    }
  },
  providerContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    width: '100px'
  },
  account: {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'left',
    paddingRight: sm
  },
  address: {
    marginLeft: '5px',
    letterSpacing: '-0.5px'
  }
})

const ProviderInfo = ({ connected, provider, userAddress, network }) => {
  const classes = useStyles()
  const addressColor = connected ? 'text' : 'warning'
  return (
    <>
      {!connected && <CircleDot circleSize={35} dotRight={11} dotSize={16} dotTop={24} keySize={14} mode='warning' />}
      <WalletIcon provider={provider.toUpperCase()} />
      <Col className={classes.account} layout='column' start='sm'>
        <Paragraph
          className={classes.network}
          noMargin
          size='xs'
          transform='capitalize'
          weight='bolder'
          data-testid='connected-wallet'
        >
          {provider}
        </Paragraph>
        <div className={classes.providerContainer}>
          {connected ? (
            <ICONHashInfo
              hash={userAddress}
              shortenHash={4}
              showIdenticon
              identiconSize='xs'
              textColor={addressColor}
              textSize='sm'
              network={network}
            />
          ) : (
              <Text size='md' color={addressColor}>
                Connection Error
              </Text>
            )}

          {/* <Paragraph className={classes.address} color={color} noMargin size="xs">
            {cutAddress}
          </Paragraph> */}
        </div>
      </Col>
      <Col className={classes.networkLabel} layout='column' start='sm'>
        <NetworkLabel network={network} />
      </Col>
    </>
  )
}

export default ProviderInfo
