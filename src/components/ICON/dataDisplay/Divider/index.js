import React from 'react'
import styled from 'styled-components'

const HorizontalDivider = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.separator};
  margin: 16px 0;
`

const VerticalDivider = styled.div`
  border-right: 2px solid ${({ theme }) => theme.colors.separator};
  margin: 0 5px;
  height: 100%;
`

const Divider = ({ className, orientation }) => {
  return orientation === 'vertical' ? (
    <VerticalDivider className={className} />
  )
    : (
      <HorizontalDivider className={className} />
    )
}

export default Divider
