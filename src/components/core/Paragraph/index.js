import classNames from 'classnames/bind'
import React from 'react'

import styles from './index.module.scss'

const cx = classNames.bind(styles)

const Paragraph = ({ align, children, className, color, dot, noMargin, size, transform, weight, ...props }) => {
  return (
    <p
      className={cx(styles.paragraph, className, weight, { noMargin, dot }, size, color, transform, align)}
      {...props}
    >
      {children}
    </p>
  )
}

export default Paragraph
