import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'
import { MultiSigWalletScore } from '@src/SCORE/MultiSigWalletScore'
import { getSafeAddress } from '@src/utils/route'
import { connect } from 'react-redux'

import TrackerOpenIcon from './img/tracker-open.svg'

import Img from '@components/core/Img'
import { xs } from '@src/theme/variables'

const useStyles = makeStyles({
  container: {
    alignItems: 'center',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    margin: `0 ${xs}`,
    padding: '0',
    transition: 'background-color .2s ease-in-out',
    '&:hover': {
      backgroundColor: '#F0EFEE'
    }
  },
  increasedPopperZindex: {
    zIndex: 2001
  }
})

const IconTrackerBtn = ({
  className = '',
  increaseZindex = false,
  type,
  value,
  networkConnected
}) => {
  const classes = useStyles()
  const customClasses = increaseZindex ? { popper: classes.increasedPopperZindex } : {}
  const msw = new MultiSigWalletScore(networkConnected, getSafeAddress())

  const getIconTrackerLink = (type, value) => {
    return `${msw.getTrackerEndpoint()}/${type}/${value}`
  }

  return (
    <Tooltip classes={customClasses} placement='top' title='Show details on ICON Tracker'>
      <a
        aria-label='Show details on ICON Tracker'
        className={cn(classes.container, className)}
        onClick={(event) => event.stopPropagation()}
        href={getIconTrackerLink(type, value)}
        rel='noopener noreferrer'
        target='_blank'
      >
        <Img alt='Show on ICON Tracker' height={20} src={TrackerOpenIcon} />
      </a>
    </Tooltip>
  )
}

const mapStateToProps = state => {
  return {
    networkConnected: state.networkConnected
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(IconTrackerBtn)
