import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'

import { styles } from './style'

import CopyBtn from '@components/core/CopyBtn'
import Block from '@components/core/Block'
import Span from '@components/core/Span'
import { shortVersionOf } from '@src/utils/strings'
import IconTrackerBtn from '@components/core/IconTrackerBtn'
import { connect } from 'react-redux'

const useStyles = makeStyles(styles)

const ICONTrackerLink = ({ className, cut, knownAddress, value }) => {
  const classes = useStyles()

  return (
    <Block className={cn(classes.ICONTrackerLink, className)}>
      <Span className={cn(knownAddress && classes.addressParagraph, classes.address)} size='md'>
        {cut ? shortVersionOf(value, cut) : value}
      </Span>
      <CopyBtn className={cn(classes.button, classes.firstButton)} content={value} />
      <IconTrackerBtn className={classes.button} value={value} />
      {/* {knownAddress !== undefined ? <EllipsisTransactionDetails address={value} knownAddress={knownAddress} /> : null} */}
    </Block>
  )
}

export default ICONTrackerLink
