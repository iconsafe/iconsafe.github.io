import { ClickAwayListener } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import React from 'react'
import styled from 'styled-components'

import { FixedIcon } from '../..'

const StyledMenu = styled(Menu)`
  && {
    .MuiMenu-list {
      div:not(:first-child) {
        border-top: 1px solid ${({ theme }) => theme.colors.separator};
      }
    }
  }
`

const MenuWrapper = styled.div`
  display: flex;
`

const MenuItemWrapper = styled.div`
  :focus {
    outline-color: ${({ theme }) => theme.colors.separator};
  }
`

const IconWrapper = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;
  outline-color: transparent;
  height: 24px;
  width: 24px;

  span {
    display: flex;
  }

  :hover {
    background-color: ${({ theme }) => theme.colors.inputField};
  }
`

const EllipsisMenu = ({ menuItems }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) =>
    setAnchorEl(event.currentTarget)

  const closeMenuHandler = () => {
    setAnchorEl(null)
  }

  const onMenuItemClick = (item) => {
    item.onClick()
    closeMenuHandler()
  }

  return (
    <ClickAwayListener onClickAway={closeMenuHandler}>
      <MenuWrapper>
        <IconWrapper onClick={handleClick}>
          <FixedIcon type='options' />
        </IconWrapper>
        <StyledMenu
          anchorEl={anchorEl}
          keepMounted
          onClose={closeMenuHandler}
          open={Boolean(anchorEl)}
        >
          {menuItems.map((item) => (
            <MenuItemWrapper key={item.label}>
              <MenuItem
                disabled={item.disabled}
                onClick={() => onMenuItemClick(item)}
              >
                {item.label}
              </MenuItem>
            </MenuItemWrapper>
          ))}
        </StyledMenu>
      </MenuWrapper>
    </ClickAwayListener>
  )
}

export default EllipsisMenu
