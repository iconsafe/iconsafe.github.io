import React from 'react'
import styled, { css } from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'

import theme from '../../theme'

const centerCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  ${centerCSS};
`

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
