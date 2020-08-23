import React from 'react'

import makeBlockie from 'ethereum-blockies-base64'
import theme from '../../theme'

const StyledImg = React.forwardRef(({ size, className, ...props }, ref) => (
  <img
    ref={ref}
    className={className}
    style={{
      height: theme.identicon.size[size],
      width: theme.identicon.size[size],
      borderRadius: '50%'
    }} {...props}
  />
))

const Identicon = ({
  size = 'md',
  address,
  ...props
}) => {
  const iconSrc = React.useMemo(() => makeBlockie(address), [address])

  return <StyledImg src={iconSrc} size={size} {...props} />
}

export default Identicon
