import React from 'react'

const Bold = ({ children, ...props }) => {
  return <b {...props}>{children}</b>
}

export default Bold
