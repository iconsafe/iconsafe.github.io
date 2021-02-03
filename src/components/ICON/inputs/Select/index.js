import React from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import SelectMUI from '@material-ui/core/Select'
import styled from 'styled-components'

import { Text } from '../../dataDisplay'

const IconImg = styled.img`
  width: 20px;
  margin-right: 10px;
`

const StyledFormControl = styled(FormControl)`
  width: 100%;
`

const StyledSelect = styled(SelectMUI)`
  background-color: ${(props) => props.theme.colors.separator};
  border-radius: 5px;
  height: 56px;
  width: 100%;
  background-color: #f0efee;

  .MuiSelect-select {
    display: flex;
    align-items: center;
  }

  &.MuiInput-underline:hover:not(.Mui-disabled):before {
    border-bottom: 2px solid ${(props) => props.theme.colors.primary};
  }
  &.MuiInput-underline:after {
    border-bottom: 2px solid ${(props) => props.theme.colors.primary};
  }
`

function Select ({
  items,
  activeItemId,
  onItemClick,
  id,
  fallbackImage,
  ...rest
}) {
  const [open, setOpen] = React.useState(false)

  const handleChange = (event) => {
    onItemClick(event.target.value)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const onFallbackImage = (e) => {
    if (!fallbackImage) {
      return
    }

    (e.target).onerror = null;
    (e.target).src = fallbackImage
  }

  return (
    <StyledFormControl>
      <StyledSelect
        labelId={id || 'generic-select'}
        id={id || 'generic-select'}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        value={activeItemId}
        onChange={handleChange}
        {...rest}
      >
        {items.map((i) => {
          return (
            <MenuItem value={i.id} key={i.id}>
              {i.iconUrl && (
                <IconImg
                  alt={i.label}
                  onError={onFallbackImage}
                  src={i.iconUrl}
                />
              )}
              <div>
                <Text size='lg' color='text'>
                  {i.label}
                </Text>
                {i.subLabel && (
                  <Text size='lg' color='secondary' strong>
                    {i.subLabel}
                  </Text>
                )}
              </div>
            </MenuItem>
          )
        })}
      </StyledSelect>
    </StyledFormControl>
  )
}

export default Select
