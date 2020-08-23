// React base
import React from 'react'
import ReactDOM from 'react-dom'
// Styling
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from '@src/theme'
// Store
import store from './store'
import { Provider } from 'react-redux'
// Router
import { HashRouter } from 'react-router-dom'
// App
import App from './components/App'

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </HashRouter>
  </Provider>,
  document.querySelector('#root')
)
