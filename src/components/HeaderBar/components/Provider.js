import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import Col from '@components/core/Col'
import Divider from '@components/core/Divider'
import { screenSm, sm } from '@src/theme/variables'

const styles = () => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',

    [`@media (min-width: ${screenSm}px)`]: {
      flexBasis: '284px',
      marginRight: '20px'
    }
  },
  provider: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flex: '1 1 auto',
    padding: sm,
    [`@media (min-width: ${screenSm}px)`]: {
      paddingLeft: sm,
      paddingRight: sm
    }
  },
  expand: {
    height: '30px',
    width: '30px'
  }
})

const Provider = ({ render, classes, info, open, toggle }) => {
  const [myRef, setMyRef] = useState(React.createRef())
  !myRef && setMyRef(React.createRef())

  return (
    <>
      <div className={classes.root} ref={myRef}>
        <Divider />
        <Col className={classes.provider} end='sm' middle='xs' onClick={toggle}>
          {info}
          <IconButton className={classes.expand} disableRipple>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Col>
      </div>
      {render(myRef)}
    </>
  )
}

export default withStyles(styles)(Provider)
