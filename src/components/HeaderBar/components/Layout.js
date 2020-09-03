import React from 'react'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import NetworkLabel from './NetworkLabel'
import Provider from './Provider'

import Spacer from '@components/core/Spacer'
import openHoc from '@components/hoc/OpenHoc'
import Col from '@components/core/Col'
import Divider from '@components/core/Divider'
import Img from '@components/core/Img'
import Row from '@components/core/Row'
import { border, headerHeight, md, screenSm, sm } from '@src/theme/variables'

const logo = require('../assets/logo-big-vertical.png')

const styles = () => ({
  root: {
    backgroundColor: '#fafafa',
    borderRadius: sm,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
    marginTop: '11px',
    minWidth: '280px',
    padding: 0
  },
  summary: {
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderBottom: `solid 2px ${border}`,
    boxShadow: '0 2px 4px 0 rgba(212, 212, 211, 0.59)',
    flexWrap: 'nowrap',
    height: headerHeight,
    position: 'fixed',
    width: '100%',
    zIndex: 1301
  },
  logo: {
    flexBasis: '125px',
    flexShrink: '0',
    flexGrow: '0',
    maxWidth: '175px',
    padding: sm,
    [`@media (min-width: ${screenSm}px)`]: {
      maxWidth: 'none',
      paddingLeft: md,
      paddingRight: md
    }
  },
  popper: {
    zIndex: 2000
  }
})

const Layout = openHoc(({ classes, clickAway, open, providerDetails, providerInfo, toggle }) => {
  return (
    <Row className={classes.summary}>
      <Col className={classes.logo} middle='xs' start='xs'>
        <Link to='/'>
          <Img src={logo} />
        </Link>
      </Col>
      <Divider />
      <Spacer />
      <Provider
        info={providerInfo}
        open={open}
        toggle={toggle}
        render={(providerRef) => (
          <Popper
            anchorEl={providerRef.current}
            className={classes.popper}
            open={open}
            placement='bottom'
            popperOptions={{ positionFixed: true }}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <>
                  <ClickAwayListener mouseEvent='onClick' onClickAway={clickAway} touchEvent={false}>
                    <List className={classes.root} component='div'>
                      {providerDetails}
                    </List>
                  </ClickAwayListener>
                </>
              </Grow>
            )}
          </Popper>
        )}
      />
    </Row>
  )
})

export default withStyles(styles)(Layout)
