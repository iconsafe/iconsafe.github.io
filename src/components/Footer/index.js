import React from 'react'
import { connect } from 'react-redux'
import styles from './Footer.module'

const Footer = () => {
  return (
    <div className={styles.root}>
      footer
    </div>
  )
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
