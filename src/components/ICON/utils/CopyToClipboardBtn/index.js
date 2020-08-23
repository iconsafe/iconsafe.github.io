import React, { useState } from 'react'

import { Icon } from '../..'
import copyTextToClipboard from './copyTextToClipboard'
import theme from '../../theme'

const StyledButton = ({ className, ...props }) => (
  <>
    <button
      className={className}
      style={{
        background: 'none',
        color: 'inherit',
        border: 'none',
        padding: '0',
        font: 'inherit',
        cursor: 'pointer',
        outlineColor: theme.colors.separator,
        display: 'flex'
      }}
      {...props}
    />
  </>
)

const CopyToClipboardBtn = ({
  className,
  textToCopy
}) => {
  const [clicked, setClicked] = useState(false)

  const copy = () => {
    copyTextToClipboard(textToCopy)
    setClicked(true)
  }

  const onButtonClick = (event) => {
    event.stopPropagation()
    copy()
  }

  const onKeyDown = (event) => {
    // prevents event from bubbling when `Enter` is pressed
    if (event.keyCode === 13) {
      event.stopPropagation()
    }
    copy()
  }

  const onButtonBlur = () =>
    setTimeout(() => setClicked(false), 300)

  return (
    <StyledButton
      className={className}
      onClick={onButtonClick}
      onKeyDown={onKeyDown}
      onMouseLeave={onButtonBlur}
    >
      <Icon
        size='sm'
        color='icon'
        type='copy'
        tooltip={clicked ? 'Copied' : 'Copy to clipboard'}
      />
    </StyledButton>
  )
}

export default CopyToClipboardBtn
