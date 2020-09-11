import React from 'react'
import TextFieldMui from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import styled from 'styled-components'

const CustomTextField = styled((props) => (
  <TextFieldMui {...props} />
))`
  width: 100%;
  background-color: #f0efee;

  && {

    .MuiFilledInput-input {
      cursor: ${({ readOnly }) => (readOnly === true ? 'not-allowed' : 'auto')};
    }

    .MuiFormLabel-root.Mui-focused {
      
      color: ${({ theme, error }) =>
    error ? theme.colors.error : theme.colors.primary};
    }

    .MuiFilledInput-underline:after {
      border-bottom: 2px solid
        ${({ theme, error }) =>
    error ? theme.colors.error : theme.colors.primary};
    }
  }
`

const TextField = ({
  input,
  value,
  onChange,
  meta,
  readOnly,
  label,
  startAdornment,
  endAdornment,
  className,
  ...rest
}) => {
  const customProps = {
    error: meta && !!meta.error,
    label: (meta && meta.error) || label,
    variant: 'filled',
    InputProps: {
      readOnly,
      startAdornment: startAdornment ? (
        <InputAdornment position='start'>{startAdornment}</InputAdornment>
      ) : null,
      endAdornment: endAdornment ? (
        <InputAdornment position='end'>{endAdornment}</InputAdornment>
      ) : null
    },
    disabled: readOnly,
    readOnly: readOnly
  }

  if (input) {
    const { name, value, ...inputRest } = input
    return (
      <CustomTextField
        {...rest}
        {...customProps}
        {...inputRest}
        className={className}
        size={undefined}
        name={name}
        checked={!!value}
        color='primary'
        value={value}
      />
    )
  }

  return (
    <CustomTextField
      {...customProps}
      className={className}
      value={value}
      color='primary'
      onChange={onChange}
    />
  )
}

export default TextField
