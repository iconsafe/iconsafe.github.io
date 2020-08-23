import CheckboxMUI from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import styled from 'styled-components'

import theme from '../../theme'

const CustomCheckbox = withStyles({
  root: {
    color: theme.colors.primary,
    '&$checked': {
      color: theme.colors.primary
    }
  }
})((props) => <CheckboxMUI color='default' {...props} />)

const StyledFormHelperText = styled(FormHelperText)`
  && {
    color: ${({ theme }) => theme.colors.error};
    margin-top: 0px;
    padding-left: 0px;
    position: relative;
  }
`

const Checkbox = ({
  checked,
  label,
  onChange,
  meta,
  input,
  ...rest
}) => {
  const getCheckboxForReactFinalForm = () => {
    const { name, value, ...inputRest } = input
    return (
      <CustomCheckbox {...rest} name={name} checked={!!value} {...inputRest} />
    )
  }

  return (
    <FormControl component='fieldset'>
      <FormControlLabel
        control={
          <>
            {input ? (
              getCheckboxForReactFinalForm()
            ) : (
                <CustomCheckbox {...rest} checked={checked} onChange={onChange} />
              )}
          </>
        }
        label={label}
      />
      {meta?.error && <StyledFormHelperText>{meta.error}</StyledFormHelperText>}
    </FormControl>
  )
}

export default Checkbox
