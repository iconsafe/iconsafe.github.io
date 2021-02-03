import classNames from 'classnames/bind'
import React from 'react'
import { capitalize } from '@src/utils/css'
import styles from './index.module'

const cx = classNames.bind(styles)

const Block = ({ children, className, justify, margin, padding, ...props }) => {
  const paddingStyle = padding ? capitalize(padding, 'padding') : undefined
  return (
    <div className={cx(className, 'block', margin, paddingStyle, justify)} {...props}>
      {children}
    </div>
  )
}

export default Block
