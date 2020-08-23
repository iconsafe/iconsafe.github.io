import React from 'react'
import styled from 'styled-components'

import { Icon } from '../../index'

const Circle = styled.div`
  background-color: ${({ disabled, error, theme }) => {
    if (error) {
      return theme.colors.error
    }
    if (disabled) {
      return theme.colors.secondaryLight
    }

    return theme.colors.primary
  }};
  color: ${({ theme }) => theme.colors.background};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    margin-top: 4px;
  }
`

const DotStep = ({
  currentIndex,
  dotIndex,
  error
}) => {
  return (
    <Circle disabled={dotIndex > currentIndex} error={error}>
      {dotIndex < currentIndex ? (
        <Icon size='sm' type='check' color='white' />
      ) : (
          dotIndex + 1
        )}
    </Circle>
  )
};

export default DotStep
