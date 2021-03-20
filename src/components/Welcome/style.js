import { createStyles } from '@material-ui/core'

import {
  md, sm, screenSm, turquoiseIcon
} from '@src/theme/variables'

export const styles = createStyles({
  root: {
    flexGrow: 0,
    padding: `0 ${sm}`,
    paddingTop: '2%',
    paddingBottom: '3%',
    [`@media (min-width: ${screenSm}px)`]: {
      paddingLeft: md,
      paddingRight: md
    },
    minHeight: '900px'
  },

  container: {
    maxWidth: '100%',
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'flex',
      maxWidth: '90%'
    }
  },

  logoContainer: {
    display: 'flex',
    justifyContent: 'center'
  },

  screen: {
    maxHeight: '90vh',
    borderRadius: '15px',
    boxShadow: '0px 0px 50px -40px rgba(0,0,0,0.75)'
  },

  textLeft: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '85%'
  },

  textLeftContent: {
    lineHeight: '65px',
    textAlign: 'center',
    fontSize: '50px',
    marginTop: '20px'
  },

  buttons: {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  button: {
    padding: '0 10% 0 10%'
  },

  textLoop: {
    color: turquoiseIcon,
    paddingLeft: '10px'
  },

  background: {
    position: 'absolute',
    top: '300px',
    left: '0px',
    zIndex: '-10'
  },

  addressInput: {
    marginBottom: '25px'
  },

  submitOpenButton: {
    paddingLeft: '10px'
  }
})
