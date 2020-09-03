import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import css from './index.module'
import Table from './Table'
import { styles } from './style'
import AddCustomToken from './AddCustomToken'
import { isWalletOwner, getMultiSigWalletAPI } from '@src/utils/msw'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import { getSafeAddressFromUrl } from '@src/utils/route'
import Button from '@components/core/Button'
import classNames from 'classnames/bind'
import AddIcon from '@material-ui/icons/Add'
import { Loader, LoadingContainer } from '@components/ICON'

const useStyles = makeStyles(styles)

const Assets = () => {
  const msw = getMultiSigWalletAPI(getSafeAddressFromUrl())
  const classes = useStyles(styles)

  const walletConnected = useSelector((state) => state.walletConnected)
  const walletOwners = useSelector((state) => state.walletOwners)
  const multisigBalances = useSelector((state) => state.multisigBalances)

  const [dialogOpen, setDialogOpen] = useState(false)

  const onDialogClose = () => {
    setDialogOpen(false)
  }

  const onClickNewToken = () => {
    setDialogOpen(true)
  }

  const granted = isWalletOwner(walletConnected, walletOwners)

  const addNewTokenButton = () => {
    return (
      <>
        <Dialog
          onClose={onDialogClose} open={dialogOpen}
        >
          <AddCustomToken
            classes={classes}
            onClose={onDialogClose}
            msw={msw}
          />
        </Dialog>

        {granted &&
          <Button
            className={classes.receive}
            color='primary'
            onClick={onClickNewToken}
            size='small'
            variant='contained'
          >
            <AddIcon
              alt='Add token'
              className={classNames(classes.leftIcon, classes.iconSmall)}
              component={undefined}
            />
          Add token
          </Button>}

      </>
    )
  }

  if (!multisigBalances) {
    return (
      <LoadingContainer>
        <Loader size='md' />
      </LoadingContainer>
    )
  }

  return (
    <div className={css.root}>
      <Table rows={multisigBalances} additionalChild={addNewTokenButton()} />
    </div>
  )
}

export default Assets
