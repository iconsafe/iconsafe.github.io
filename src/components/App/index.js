import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import styles from './App.module'
import Safe from '@components/Safe'
import Welcome from '@components/Welcome'
import Footer from '@components/Footer'

const App = () => {
  return (
    <div className={styles.root}>
      <Switch>
        <Route path='/safe/:address' render={(props) => <Safe {...props} />} />
        <Route exact path='/' render={(props) => <Welcome {...props} />} />
        <Route render={() => <Redirect to='/' />} />
      </Switch>
      <Footer />
    </div>
  )
}

export default App
