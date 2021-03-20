import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import * as React from 'react'

import Link from '@components/core/Link'
import { screenSm, secondary, sm } from '@src/theme/variables'

const useStyles = makeStyles({
  footer: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    flexShrink: '1',
    flexWrap: 'wrap',
    justifyContent: 'center',
    margin: '0 auto',
    maxWidth: '100%',
    padding: `20px ${sm} 20px`,
    width: `${screenSm}px`
  },
  item: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '13px'
  },
  link: {
    color: secondary,
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline'
    }
  },
  sep: {
    color: 'rgba(0, 0, 0, 0.54)',
    margin: '0 10px'
  },
  buttonLink: {
    padding: '0'
  }
})

const appVersion = process.env.REACT_APP_APP_VERSION ? `v${process.env.REACT_APP_APP_VERSION} ` : 'Versions'

const Footer = () => {
  const date = new Date()
  const classes = useStyles()

  return (
    <footer className={classes.footer}>
      <span className={classes.item}>Powered by ICONation</span>
      <span className={classes.sep}>|</span>
      {/* <Link className={cn(classes.item, classes.link)} target='_blank' to=''>
        Terms
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} target='_blank' to=''>
        Privacy
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} target='_blank' to=''>
        Licenses
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} target='_blank' to=''>
        Imprint
      </Link>
      <span className={classes.sep}>|</span>
      <Link className={cn(classes.item, classes.link)} target='_blank' to=''>
        Cookie Policy
      </Link> */}
      {/* <span className={classes.sep}>-</span> */}
      {/* <span className={classes.sep}>|</span> */}
      <Link
        className={cn(classes.item, classes.link)}
        target='_blank'
        to='https://github.com/iconation/ICONSafe-SCORE'
      >
        Source code
      </Link>
    </footer>
  )
}

export default Footer
