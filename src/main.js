import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { theme } from '@src/theme'
import { theme as styledTheme } from '@components/core/theme'
import store from './store'
import { setWalletConnected, setWalletProvider } from '@src/store/actions'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import App from './components/App'
import { getAnciliaAPI } from '@src/utils/ancilia'
import { SnackbarProvider } from 'notistack'

// Initialize store
const ancilia = getAnciliaAPI()
const loggedWallet = ancilia.getLoggedInWallet()
if (loggedWallet) {
  const { address, provider } = loggedWallet
  store.dispatch(setWalletConnected(address))
  store.dispatch(setWalletProvider(provider))
}

ReactDOM.render(
  <ThemeProvider theme={styledTheme}>
    <Provider store={store}>
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={10}>
            <App />
          </SnackbarProvider>
        </MuiThemeProvider>
      </HashRouter>
    </Provider>
  </ThemeProvider>
  ,
  document.querySelector('#root')
)
