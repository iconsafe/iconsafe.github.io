import { screenSm, md, lg, sm } from '@src/theme/variables'
import { createStyles } from '@material-ui/core/styles'

export const styles = createStyles({

  addTokenDialog: {
    minWidth: '1000px'
  },
  title: {
    padding: `${lg} 0 20px`,
    fontSize: md
  },
  formContainer: {
    padding: '0 20px',
    minHeight: '369px',
    minWidth: '500px'
  },
  addressInput: {
    marginBottom: '15px',
    display: 'flex',
    flexGrow: 1,
    backgroundColor: '#efefef'
  },
  tokenSymbol: {
    marginTop: '30px'
  },
  tokenImageHeading: {
    margin: '0 0 15px'
  },
  checkbox: {
    padding: '0 7px 0 0',
    width: '18px',
    height: '18px'
  },
  checkboxLabel: {
    letterSpacing: '-0.5px'
  },
  buttonRow: {
    color: 'black',
    height: '84px',
    justifyContent: 'center'
  },
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'space-between',
    maxHeight: '75px',
    boxSizing: 'border-box'
  },

  //
  close: {
    height: '35px',
    width: '35px'
  },
  iconSmall: {
    fontSize: 16
  },
  receive: {
    borderRadius: '4px',
    marginLeft: sm,
    width: '50%',
    color: '#ffffff',

    '& > span': {
      fontSize: '14px'
    },
    [`@media (min-width: ${screenSm}px)`]: {
      minWidth: '95px',
      width: 'auto'
    }
  },
  leftIcon: {
    marginRight: sm
  },
  tokenLogo: {
    margin: 'auto'
  }
})
