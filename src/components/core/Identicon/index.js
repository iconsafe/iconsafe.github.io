import React from 'react'

import makeBlockie from 'ethereum-blockies-base64'

const StyledImg = ({ diameter, className, ...props }) => {
  return (
    <img
      className={className}
      style={{
        height: diameter + 'px',
        width: diameter + 'px',
        borderRadius: '50%'
      }} {...props}
    />
  )
}

const Identicon = ({ diameter = 32, address, className }) => {
  const iconSrc = React.useMemo(() => makeBlockie(address), [address])
  return <StyledImg src={iconSrc} diameter={diameter} className={className} />
}

export default Identicon
