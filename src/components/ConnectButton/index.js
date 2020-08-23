import React, { useState } from 'react'
import Button from '@src/components/core/Button'
import Img from '@src/components/core/Img'
import wallet from '@src/assets/icons/wallet.svg'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import styles from './index.module.scss'
import classNames from 'classnames/bind'
import { createStyles, withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import WalletIcon from '@src/components/HeaderBar/components/WalletIcon'
import { MultiSigWalletScore } from '@src/SCORE/MultiSigWalletScore'
import { WALLET_PROVIDER } from '@src/SCORE/Ancilia'
import { setWalletConnected, setWalletProvider } from '@src/store/actions'
import { connect } from 'react-redux'
import { getSafeAddress } from '@src/utils/route'

const cx = classNames.bind(styles)

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

const ProviderDialog = ({ provider, onClickCallback }) => {
  return (
    <div className={cx('provider')} onClick={() => { onClickCallback(provider) }}>
      <div className={cx('provider-icon')}>
        <WalletIcon provider={provider.toUpperCase()} />
      </div>
      <div className={cx('provider-label')}>
        {provider}
      </div>
    </div>
  )
}

const SelectWalletDialog = ({ onClose, selectedValue, open, networkConnected, setWalletConnected, setWalletProvider }) => {
  const safeWallet = getSafeAddress()
  const msw = new MultiSigWalletScore(networkConnected, safeWallet)

  const handleClose = () => {
    onClose(selectedValue)
  }

  const onClickProviderLedger = () => {
    window.alert('Not yet implemented')
  }

  const onClickProviderMagic = () => {
    window.alert('Not yet implemented')
  }

  const onClickProviderICONex = () => {
    msw.login(WALLET_PROVIDER.ICONEX).then(address => {
      setWalletConnected(address)
      setWalletProvider('ICONex')
      onClose(address)
    }).catch(error => {
      // silently catch user cancellation
      console.log(error)
    })
  }

  const onClickProviderTrezor = () => {
    window.alert('Not yet implemented')
  }

  const onClickProviderKeystore = () => {
    window.alert('Not yet implemented')
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
      <DialogTitle id='customized-dialog-title' onClose={handleClose}>
        <div className={cx('dialog-title')}>
          <div className={cx('dialog-wallet')}>
            <Img alt='Wallet' height={20} src={wallet} />
          </div>
          <h3 className={cx('dialog-title-text')}>Select a Wallet</h3>
        </div>
      </DialogTitle>

      <DialogContent dividers>
        <ProviderDialog onClickCallback={() => { onClickProviderLedger() }} provider='Ledger' />
        <ProviderDialog onClickCallback={() => { onClickProviderMagic() }} provider='Magic' />
        <ProviderDialog onClickCallback={() => { onClickProviderICONex() }} provider='ICONex' />
        <ProviderDialog onClickCallback={() => { onClickProviderTrezor() }} provider='Trezor' />
        <ProviderDialog onClickCallback={() => { onClickProviderKeystore() }} provider='Keystore' />
      </DialogContent>

    </Dialog>
  )
}

const ConnectButton = ({ setWalletConnected, setWalletProvider, networkConnected, ...props }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(null)

  const onButtonClick = () => {
    setDialogOpen(true)
  }

  const onDialogClose = (value) => {
    setDialogOpen(false)
    setSelectedValue(value)
  }

  return (
    <div>

      <SelectWalletDialog
        selectedValue={selectedValue}
        open={dialogOpen}
        onClose={onDialogClose}
        setWalletConnected={setWalletConnected}
        setWalletProvider={setWalletProvider}
        networkConnected={networkConnected}
      />

      <Button
        color='primary'
        minWidth={140}
        onClick={onButtonClick}
        variant='contained'
        {...props}
      >
        Connect
      </Button>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    networkConnected: state.networkConnected
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setWalletConnected: value => dispatch(setWalletConnected(value)),
    setWalletProvider: value => dispatch(setWalletProvider(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectButton)
