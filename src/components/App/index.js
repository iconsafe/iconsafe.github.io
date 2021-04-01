import React, { useEffect, useRef } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import styles from './App.module'
import Safe from '@components/Safe'
import Welcome from '@components/Welcome'
import Footer from '@components/Footer'
import { SnackbarProvider } from 'notistack'
import Button from '@components/core/Button'

const App = () => {
  const notistackRef = useRef()

  useEffect(() => {
    const displayPreference = window.localStorage.getItem('theme')
    if (displayPreference === 'dark') {
      document.documentElement.classList.toggle('dark-mode')
      document.querySelectorAll('.inverted').forEach((result) => {
        result.classList.toggle('dark-mode')
      })
    }
  })

  return (
    <SnackbarProvider
      maxSnack={10}
      ref={notistackRef}
      action={(key) => (
        <Button
          onClick={() => notistackRef.current.closeSnackbar(key)}
          style={{ color: '#fff', fontSize: '20px' }}
        >
          X
        </Button>
      )}
    >
      <div className={styles.root}>
        <Switch>
          <Route path='/safe/:address' render={(props) => <Safe {...props} />} />
          <Route exact path='/' render={(props) => <Welcome {...props} />} />
          <Route render={() => <Redirect to='/' />} />
        </Switch>
        <Footer />
      </div>
    </SnackbarProvider>
  )
}

export default App
