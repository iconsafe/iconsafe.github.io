import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'

import Block from '@src/components/core/Block'
import Bold from '@src/components/core/Bold'
import Span from '@src/components/core/Span'
import { ICONTrackerLink } from '@components/ICON'
import { displayUnit } from '@src/utils/icon'
import Img from '@components/core/Img'
import { getTokenIcon } from '@components/TokenIcon'
import { styles } from './styles'
import { makeStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'

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
            - Change <Bold>safe owners requirement</Bold> to
            <Span className={classes.greenText}> {parseInt(getTxParam(tx, 'owners_required').value)}</Span>
          </div>
        )

      case 'add_wallet_owner':
        return (
          <div className={classes.content}>
            {getTxParam(tx)}
            - <Bold>Add a new owner</Bold> ({getTxParam(tx, 'name').value}) :
            <Span className={classes.greenText}> <ICONTrackerLink value={getTxParam(tx, 'address').value} /> </Span>
          </div>
        )

      case 'remove_wallet_owner':
        return msw.get_wallet_owner(getTxParam(tx, 'wallet_owner_uid').value).then(owner => {
          return (
            <div className={classes.content}>
              - <Bold>Remove an existing owner</Bold> ({owner.name}) :
              <Span className={classes.greenText}> <ICONTrackerLink value={owner.address} /> </Span>
            </div>
          )
        })

      default:
        return `Unsupported operation ${tx.method_name} !`
    }
  }

  return (
    <Block className={classes.container}>
      {content}
    </Block>
  )
}

export default WalletOperationDescription
