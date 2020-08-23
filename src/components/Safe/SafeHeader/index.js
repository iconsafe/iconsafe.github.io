import React from 'react'
import { connect } from 'react-redux'
import styles from './SafeHeader.module'
import SafeSummary from '@components/Safe/SafeSummary'

const SafeHeader = () => {
  return (
    <div className={styles.root}>
      <SafeSummary />
    </div>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(SafeHeader)
