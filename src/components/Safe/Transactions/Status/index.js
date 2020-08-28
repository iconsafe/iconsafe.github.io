import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import * as React from 'react'

import AwaitingIcon from './assets/awaiting.svg'
import ErrorIcon from './assets/error.svg'
import OkIcon from './assets/ok.svg'
import { styles } from './style'

import Block from '@components/core/Block'
import Img from '@components/core/Img'
import Paragraph from '@components/core/Paragraph/'

const statusToIcon = {
  EXECUTED: OkIcon,
  cancelled: ErrorIcon,
  FAILED: ErrorIcon,
  awaiting_your_confirmation: AwaitingIcon,
  awaiting_confirmations: AwaitingIcon,
  awaiting_execution: AwaitingIcon,
  WAITING: <CircularProgress size={14} />
}

const statusToLabel = {
  EXECUTED: 'Success',
  cancelled: 'Cancelled',
  FAILED: 'Failed',
  awaiting_your_confirmation: 'Awaiting your confirmation',
  awaiting_confirmations: 'Awaiting confirmations',
  awaiting_execution: 'Awaiting execution',
  WAITING: 'Pending'
}

const statusIconStyle = {
  height: '14px',
  width: '14px'
}

const Status = ({ classes, status }) => {
  const Icon = statusToIcon[status]

  return (
    <Block className={`${classes.container} ${classes[status]}`}>
      {typeof Icon === 'object' ? Icon : <Img alt={statusToLabel[status]} src={Icon} style={statusIconStyle} />}
      <Paragraph className={classes.statusText} noMargin data-testid={`tx-status-${statusToLabel[status]}`}>
        {statusToLabel[status]}
      </Paragraph>
    </Block>
  )
}

export default withStyles(styles)(Status)
