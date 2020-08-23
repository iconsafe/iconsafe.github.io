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

const StyledSelect = styled(SelectMUI)`
  background-color: ${(props) => props.theme.colors.separator};
  border-radius: 5px;
  height: 56px;
  width: 140px;

  .MuiSelect-select {
    display: flex;
    align-items: center;
    padding-left: 15px;
  }

  .MuiSelect-selectMenu {
    font-family: ${(props) => props.theme.fonts.fontFamily};
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
    <div>
      <FormControl>
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
                  <Text size='sm' color='text'>
                    {i.label}
                  </Text>
                  {i.subLabel && (
                    <Text size='sm' color='secondary' strong>
                      {i.subLabel}
                    </Text>
                  )}
                </div>
              </MenuItem>
            )
          })}
        </StyledSelect>
      </FormControl>
    </div>
  )
}

export default Select
