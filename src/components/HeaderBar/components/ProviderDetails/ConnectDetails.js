import React from 'react'
import ConnectButton from '@components/ConnectButton'
import CircleDot from '@components/HeaderBar/components/CircleDot'
import Block from '@components/core/Block'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'
import { lg, md } from '@src/theme/variables'
import { createStyles, withStyles } from '@material-ui/core/styles'

const styles = () =>
  createStyles({
    container: {
      padding: `${md} 12px`
    },
    logo: {
      justifyContent: 'center'
    },
    text: {
      letterSpacing: '-0.6px',
      flexGrow: 1,
      textAlign: 'center'
    },
    connect: {
      padding: `${md} ${lg}`,
      textAlign: 'center'
    },
    connectText: {
      letterSpacing: '1px'
    },
    img: {
      margin: '0px 2px'
    }
  })

const ConnectDetails = withStyles(styles)(({ classes }) => {
  return (
    <>
      <div className={classes.container}>
        <Row align='center' margin='lg'>
          <Paragraph className={classes.text} noMargin size='lg' weight='bolder'>
            Connect a Wallet
          </Paragraph>
        </Row>
      </div>
      <Row className={classes.logo} margin='lg'>
        <CircleDot center circleSize={75} dotRight={25} dotSize={25} dotTop={50} keySize={32} mode='error' />
      </Row>
      <Block className={classes.connect}>
        <ConnectButton />
      </Block>
    </>
  )
})

export default ConnectDetails
