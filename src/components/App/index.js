import React from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import styles from './App.module'
import Safe from '@components/Safe'
import HeaderBar from '@components/HeaderBar'
import Footer from '@components/Footer'

const ConnectedApp = () => {
  return (
    <div className={styles.root}>
      <HeaderBar />
      <Switch>
        <Route exact path='/safe/:address' render={(props) => <Safe {...props} />} />
        <Route render={() => <Redirect to='/' />} />
      </Switch>
      <Footer />
    </div>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedApp)
