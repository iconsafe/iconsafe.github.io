import React, { useState } from 'react'
import { styles } from './style'
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles'

import Block from '@components/core/Block'
import Col from '@components/core/Col'
import Row from '@components/core/Row'
import Img from '@components/core/Img'
import Heading from '@components/core/Heading'
import css from './index.module'
import Button from '@components/core/Button'
import Span from '@components/core/Span'
import cn from 'classnames'
import TextLoop from 'react-text-loop'
import classNames from 'classnames/bind'
import wallet from '@src/assets/icons/wallet.svg'
import GnoForm from '@components/core/GnoForm'
import Hairline from '@components/core/Hairline'
import Bold from '@components/core/Bold'
import CopyBtn from '@components/core/CopyBtn'
import TrackerOpenIcon from '@components/core/IconTrackerBtn/img/tracker-open.svg'

import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import AddressInput from '@components/core/AddressInput'
import { mustBeSafeContractAddress, mustBeICONContractAddress } from '@components/core/validator'
import { useHistory } from 'react-router-dom'

const background = require('./assets/background.svg')
const screenImg = require('./assets/screen.png')
const logoImg = require('./assets/big-logo.png')
const cx = classNames.bind(css)

const useStyles = makeStyles(styles)

const dialogStyle = (theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2)
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500]
    }
  })

const DialogTitle = withStyles(dialogStyle)((props) => {
  const { children, classes, onClose, ...other } = props
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton aria-label='close' className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  )
})

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: '500px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
}))(MuiDialogContent)

const Welcome = () => {
  const [openSafe, setOpenSafe] = useState(false)
  const classes = useStyles()
  const [safeAddress, setSafeAddress] = useState(null)
  const history = useHistory()

  const onOpenSafe = () => {
    setOpenSafe(true)
  }

  const onHowItWorks = () => {
    window.open('https://www.youtube.com/watch?v=_guMkR7Q2JA&vq=hd1080', '_blank')
  }

  const handleClose = (value) => {
    setOpenSafe(false)
  }

  const formMutators = {
    setSafeAddress: (args, state, utils) => {
      utils.changeValue(state, 'safeAddress', () => args[0])
    }
  }

  const handleSubmit = (values) => {
    const { safeAddress } = values
    setSafeAddress(safeAddress)
    history.push(`/safe/${safeAddress}/assets`)
  }

  const getSafeDialog = () => (
    <Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={openSafe}>

      <DialogTitle id='customized-dialog-title' onClose={handleClose}>
        <div className={cx('dialog-title')}>
          <div className={cx('dialog-wallet')}>
            <Img alt='Wallet' height={20} src={wallet} />
          </div>
          <h3 className={cx('dialog-title-text')}>Open a Safe</h3>
        </div>
      </DialogTitle>

      <Hairline />
      <Block style={{
        padding: '20px',
        textAlign: 'left',
        maxWidth: '500px'
      }}
      >
        <Bold style={{ fontSize: '20px' }}>Instructions for the ICONation TestNet: </Bold>
        <br />
        <br />
        <Col>

          <Row>
            <Span>• <b>Copy and paste</b> the demo Safe Contract address below : </Span>
          </Row>
          <br />

          <Row>
            <Span style={{ display: 'flex' }}>
              <Span>cxcb6469ba90e726fa1862dd4dfb2e4497c0108654</Span>
              <CopyBtn content='cxcb6469ba90e726fa1862dd4dfb2e4497c0108654' />
            </Span>
          </Row>
          <br />

          <Row>
            <Span>• Once connected, <Bold> feel free to do anything!</Bold></Span>
          </Row>
          <Row>
            <Span>
              <Bold>Only 1 confirmation</Bold> is required to confirm any outgoing transaction, so you will be able to confirm transaction by yourself.
            </Span>
          </Row>
          <br />

          <Row>
            <Span>
              • You may want to some <Bold>send some testnet ICX</Bold> to the safe address for testing, feel free to use the Sharpn Yeouido Faucet:
              <br />
              <a style={{ display: 'flex' }} target='_blank' rel='noopener noreferrer' href='https://faucet.sharpn.tech/'>
                https://faucet.sharpn.tech/ <Img src={TrackerOpenIcon} />
              </a>
            </Span>
          </Row>

        </Col>
      </Block>

      <DialogContent dividers style={{ display: 'flex', flexDirection: 'column' }}>

        <GnoForm
          onSubmit={handleSubmit}
          formMutators={formMutators}
        >
          {(...args) => {
            const mutators = args[3]

            return (
              <>
                <AddressInput
                  validators={[mustBeICONContractAddress, mustBeSafeContractAddress]}
                  fieldMutator={mutators.setSafeAddress}
                  className={classes.addressInput}
                  name='safeAddress'
                  placeholder='Safe address'
                  text='Safe address'
                />
                <Button
                  className={classes.submitOpenButton}
                  color='primary'
                  size='small'
                  type='submit'
                  variant='contained'
                >
                  Open
                </Button>
              </>
            )
          }}
        </GnoForm>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      <Block className={classes.root}>
        <Img src={background} className={classes.background} />
        <Row className={classes.container}>
          <Col xs={4} className={classes.textLeft}>

            <Img src={logoImg} />

            <Heading align='left' margin='lg' tag='h1' weight='bold' className={classes.textLeftContent}>
              The first multisig <br /> wallet to manage digital assets on <br /> ICON for
              <TextLoop>
                <Span className={classes.textLoop}>DAOs</Span>
                <Span className={classes.textLoop}>holders</Span>
                <Span className={classes.textLoop}>investors</Span>
                <Span className={classes.textLoop}>developers</Span>
                <Span className={classes.textLoop}>funds</Span>
                <Span className={classes.textLoop}>companies</Span>
              </TextLoop>
            </Heading>

            <Block className={classes.buttons}>
              <Button
                className={classes.button}
                color='primary'
                onClick={() => onOpenSafe()}
                size='small'
                variant='contained'
              >
                Open Safe
              </Button>

              <Button
                className={classes.button}
                color='primary'
                onClick={() => onHowItWorks()}
                size='small'
                variant='contained'
              >
                How it works
              </Button>
            </Block>
          </Col>

          <Col className={classes.logoContainer}>
            <Img src={screenImg} className={cn(classes.screen, css.screenAnimation)} />
          </Col>
        </Row>
      </Block>

      {getSafeDialog()}
    </>
  )
}

export default Welcome
