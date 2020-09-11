import React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '@components/ICON'

import Dashboard from './components/Dashboard'

export default () => (
  <ThemeProvider theme={theme}>
    <Dashboard />
  </ThemeProvider>
)
