import React from 'react'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'

import theme from '../../theme'

const StyledCircularProgress = styled(
  ({ size, className }) => (
    <CircularProgress size={theme.loader.size[size]} className={className} />
  )
)`
  &.MuiCircularProgress-colorPrimary {
    color: ${({ theme, color = 'primary' }) => theme.colors[color]};
  }
`

const Loader = ({ className, size, color }) => (
  <StyledCircularProgress size={size} color={color} className={className} />
)

export default Loader
