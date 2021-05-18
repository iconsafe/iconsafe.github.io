import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getMultiSigWalletAPI } from '@src/utils/msw'

import Block from '@components/core/Block'
import Bold from '@components/core/Bold'
import Span from '@components/core/Span'
import { styles } from './styles'
import { makeStyles } from '@material-ui/core/styles'
import { displayUnit } from '@src/utils/icon'
import { IconConverter } from 'icon-sdk-js'

const useStyles = makeStyles(styles)

const IissOperationDescription = ({ tx }) => {
  const safeAddress = useSelector((state) => state.safeAddress)
  const msw = getMultiSigWalletAPI(safeAddress)
  const [content, setContent] = useState('Loading...')

  const classes = useStyles()

  const getPrepName = (pReps, address) => {
    const value = pReps?.find(prep => prep.address === address)
    return value ? value.name : address
  }

  useEffect(() => {
    getContent().then(result => {
      setContent(result)
    })
  }, [])

  const getTxParam = (tx, name) => {
    return tx.params.filter(param => param.name === name)[0]
  }

  const displayDelegation = (preps, delegation) => {
    delegation = JSON.parse(delegation.value)
    return (
      <React.Fragment key={delegation.address}>
        Delegate <Bold><Span className={classes.cyanText}>{displayUnit(delegation.value.value, 18)} ICX </Span></Bold> to <Bold>{getPrepName(preps, delegation.address.value)}</Bold>
        <br />
      </React.Fragment>
    )
  }

  const getContent = async () => {
    switch (tx.method_name) {
      case 'setStake':
        return (
          <div className={classes.content}>
            Change <Bold>stake amount </Bold> to
            <Span className={classes.cyanText}> {displayUnit(getTxParam(tx, 'value').value, 18)} ICX</Span>
          </div>
        )

      case 'setDelegation': {
        const preps = await msw.getPReps()
        const delegations = JSON.parse(tx.params[0].value)
        const delegationsContent = (delegations.length > 0)
          ? delegations.map(delegation => displayDelegation(preps, delegation))
          : 'Remove delegations from all P-Reps'

        return (
          <div className={classes.content}>
            {delegationsContent}
          </div>
        )
      }

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

export default IissOperationDescription
