import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from '@components/core/Button'
import Img from '@components/core/Img'
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
import WalletIcon from '@components/HeaderBar/components/WalletIcon'
import { WALLET_PROVIDER } from '@src/SCORE/Ancilia'
import * as dispatchers from '@src/store/actions'
import { getMultiSigWalletAPI } from '@src/utils/msw'

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

const SelectWalletDialog = ({ msw, onClose, selectedValue, open }) => {
  const dispatch = useDispatch()

  const handleClose = () => {
    onClose(selectedValue)
  }

  const onLogin = (address, provider) => {
    dispatch(dispatchers.setWalletConnected(address))
    dispatch(dispatchers.setWalletProvider(provider))
    onClose(address)
    Promise.all([msw.get_wallet_owner_uid(address)]).then(([connectedWalletOwnerUid]) => {
      dispatch(dispatchers.setConnectedWalletOwnerUid(connectedWalletOwnerUid))
      msw.get_wallet_owner(connectedWalletOwnerUid).then(connectedWalletOwner => {
        dispatch(dispatchers.setConnectedWalletOwner(connectedWalletOwner))
      })
    }).catch(error => {
      if (error.includes('WalletOwnerDoesntExist')) {
      }
    })
  }

  const onClickProviderLedger = () => {
    msw.login(WALLET_PROVIDER.LEDGER).then(address => {
      onLogin(address, WALLET_PROVIDER.LEDGER)
    })
  }

  const onClickProviderMagic = () => {
    window.alert('Not yet implemented')
  }

  const onClickProviderICONex = () => {
    msw.login(WALLET_PROVIDER.ICONEX).then(address => {
      onLogin(address, WALLET_PROVIDER.ICONEX)
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

const ConnectButton = () => {
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)

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
        msw={msw}
        selectedValue={selectedValue}
        open={dialogOpen}
        onClose={(value) => onDialogClose(value)}
      />

      <Button
        color='primary'
        minWidth={140}
        onClick={() => onButtonClick()}
        variant='contained'
      >
        Connect
      </Button>
    </div>
  )
}

export default ConnectButton
