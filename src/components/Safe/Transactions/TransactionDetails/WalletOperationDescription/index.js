import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'

import Block from '@components/core/Block'
import Bold from '@components/core/Bold'
import Span from '@components/core/Span'
import { ICONTrackerLink } from '@components/ICON'
import { styles } from './styles'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'

const useStyles = makeStyles(styles)

const WalletOperationDescription = ({ tx }) => {
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [content, setContent] = useState('Loading...')

  const classes = useStyles()

  useEffect(() => {
    getContent().then(result => {
      setContent(result)
    })
  }, [])

  const getTxParam = (tx, name) => {
    return tx.params.filter(param => param.name === name)[0]
  }

  const getContent = async () => {
    switch (tx.method_name) {
      case 'set_wallet_owners_required':
        return (
          <div className={classes.content}>
            Change <Bold>safe owners requirement</Bold> to
            <Span className={classes.cyanText}> {parseInt(getTxParam(tx, 'owners_required').value)}</Span>
          </div>
        )

      case 'add_wallet_owner':
        return (
          <div className={classes.content}>
            {getTxParam(tx)}
            <Bold>Add a new owner</Bold> ({getTxParam(tx, 'name').value}) :
            <Span className={classes.cyanText}> <ICONTrackerLink value={getTxParam(tx, 'address').value} /> </Span>
          </div>
        )

      case 'force_cancel_transaction':
        return (
          <div className={classes.content}>
            {getTxParam(tx)}
            <Bold>Force cancel</Bold> a transaction (UID = {getTxParam(tx, 'transaction_uid').value})
          </div>
        )

      case 'remove_wallet_owner':
        return msw.get_wallet_owner(getTxParam(tx, 'wallet_owner_uid').value).then(owner => {
          return (
            <div className={classes.content}>
              <Bold>Remove an existing owner</Bold> ({owner.name}) :
              <Span className={classes.cyanText}> <ICONTrackerLink value={owner.address} /> </Span>
            </div>
          )
        })

      case 'replace_wallet_owner':
        return msw.get_wallet_owner(getTxParam(tx, 'old_wallet_owner_uid').value).then(owner => {
          return (
            <Block className={classes.content}>
              <Bold>Replace or edit an existing owner</Bold> :<br />
              <Block>
                Old Name : <Span className={classes.cyanText}> {owner.name} </Span>
              </Block>

              <Block className={classes.addressLine}>
                Old Address :
                <Span className={cn(classes.cyanText, classes.trackerLink)}>
                  <ICONTrackerLink value={owner.address} />
                </Span>
              </Block>

              <Block>
                New Name : <Span className={classes.cyanText}> {getTxParam(tx, 'new_name').value} </Span>
              </Block>

              <Block className={classes.addressLine}>
                New Address :
                <Span className={cn(classes.cyanText, classes.trackerLink)}>
                  <ICONTrackerLink value={getTxParam(tx, 'new_address').value} />
                </Span>
              </Block>
            </Block>
          )
        })

      default:
        return `Unsupported operation "${tx.method_name}" !`
    }
  }

  return (
    <Block className={classes.container}>
      {content}
    </Block>
  )
}

export default WalletOperationDescription
