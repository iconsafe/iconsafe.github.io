import React from 'react'

import makeBlockie from 'ethereum-blockies-base64'
import styled from 'styled-components'

const StyledImg = styled.img`
  height: ${({ size, theme }) => theme.identicon.size[size]};
  width: ${({ size, theme }) => theme.identicon.size[size]};
  border-radius: 50%;
`

const Identicon = ({
  size = 'md',
  address,
  ...rest
}) => {
  const iconSrc = React.useMemo(() => makeBlockie(address), [address])

  return <StyledImg src={iconSrc} size={size} {...rest} />
}

export default Identicon
