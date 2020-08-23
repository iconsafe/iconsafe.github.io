import React from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import { withStyles } from '@material-ui/core/styles'
import { rgba } from 'polished'

import theme from '../../theme'

const StyledText = ({ tooltip, color, size, strong, center, className, ...props }) => {
  return (
    <p
      className={className}
      style={{
        fontFamily: 'Averta',
        display: tooltip === undefined ? 'inline-block' : 'block',
        color: color ? theme.colors[color] : theme.colors.text,
        margin: 0,
        fontWeight: (strong ? 'bold' : 'normal'),
        fontSize: theme.text.size[size].fontSize,
        lineHeight: theme.text.size[size].lineHeight,
        textAlign: (center ? 'center' : 'start')
      }}
      {...props}
    />
  )
}

const StyledTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: theme.colors.white,
    color: theme.colors.text,
    boxShadow: `0px 0px 10px ${rgba(theme.colors.shadow.color, 0.2)}`
  },
  arrow: {
    color: theme.colors.white,
    boxShadow: `0px 0px 10px ${rgba(theme.colors.shadow.color, 0.2)}`
  }
}))(Tooltip)

const Text = ({ children, tooltip, ...rest }) => {
  const TextElement = <StyledText {...rest}>{children}</StyledText>

  return tooltip === undefined ? (
    TextElement
  )
    : (
      <StyledTooltip title={tooltip} placement='bottom' arrow>
        {TextElement}
      </StyledTooltip>
    )
}

export default Text
