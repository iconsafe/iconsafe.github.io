import { createMuiTheme } from '@material-ui/core/styles'
import Averta from '@src/assets/fonts/Averta-normal.woff2'
import { turquoiseIcon, blackIcon, fontColor, background } from './variables'

const avertaFont = {
  fontFamily: 'Averta',
  src: `url(${Averta}) format('woff2')`
}

const theme = createMuiTheme({
  palette: {
    background: {
      default: background
    },
    text: {
      primary: fontColor,
      secondary: fontColor
    },
    primary: {
      main: turquoiseIcon
    },
    secondary: {
      main: blackIcon
    }
  },
  typography: {
    fontFamily: 'Averta'
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [avertaFont]
      }
    }
  }
})

export default theme
