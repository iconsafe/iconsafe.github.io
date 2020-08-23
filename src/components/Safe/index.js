import React from 'react'
import { connect } from 'react-redux'
import styles from './Safe.module'
import SafeHeader from '@components/Safe/SafeHeader'
import SafeTabChoser from '@components/Safe/SafeTabChoser'

const Safe = () => {
  return (
    <div className={styles.root}>
      <SafeHeader />
      <SafeTabChoser />
    </div>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Safe)
