import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import styles from './App.module'
import Safe from '@components/Safe'
import Welcome from '@components/Welcome'
import HeaderBar from '@components/HeaderBar'
import Footer from '@components/Footer'

const App = () => {
  return (
    <div className={styles.root}>
      <HeaderBar />
      <Switch>
        <Route exact path='/safe/:address' render={(props) => <Safe {...props} />} />
        <Route exact path='/' render={(props) => <Welcome {...props} />} />
        <Route render={() => <Redirect to='/' />} />
      </Switch>
      <Footer />
    </div>
  )
}

export default App
