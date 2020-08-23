import React from 'react'
import { connect } from 'react-redux'
import styles from './Assets.module'
import Table from './Table'

const Assets = ({ assets }) => {
  return (
    <div className={styles.root}>
      <Table rows={assets} />
    </div>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Assets)
