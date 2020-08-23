import React from 'react'
import SwitchMui from '@material-ui/core/Switch'
import styled from 'styled-components'
import { rgba } from 'polished'

const StyledSwitch = styled(({ ...rest }) => <SwitchMui {...rest} />)`
  && {
    .MuiIconButton-label,
    .MuiSwitch-colorSecondary.Mui-checked {
      color: ${({ checked, theme }) =>
    checked ? theme.colors.primary : theme.colors.icon};
    }

    .MuiSwitch-colorSecondary.Mui-checked:hover {
      background-color: ${({ theme }) => rgba(theme.colors.primary, 0.08)};
    }

    .Mui-checked + .MuiSwitch-track {
      background-color: ${({ theme }) => theme.colors.primaryLight};
    }
  }
`

const Switch = ({ checked, onChange }) => {
  const onSwitchChange = (_event, checked) => onChange(checked)

  return <StyledSwitch checked={checked} onChange={onSwitchChange} />
}

export default Switch
