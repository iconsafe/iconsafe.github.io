import React from 'react'

import styled from 'styled-components'

const StyledDot = styled.div`
  border-radius: 50%;
  background-color: ${({ theme, color }) => theme.colors[color]};
  height: ${({ theme, size }) => theme.statusDot.size[size]};
  width: ${({ theme, size }) => theme.statusDot.size[size]};
`

const StatusDot = (props) => (
  <StyledDot {...props} />
)

export default StatusDot
