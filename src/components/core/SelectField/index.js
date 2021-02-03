import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import React from 'react'
import { OnChange } from 'react-final-form-listeners'
import { trimSpaces } from '@src/utils/strings'

const style = {
  minWidth: '100%'
}

const SelectInput = ({
  classes,
  disableError,
  formControlProps,
  input: { name, onChange, value, ...restInput },
  label,
  meta,
  renderValue,
  fieldMutator,
  ...rest
}) => {
  const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched && !disableError
  const inputProps = {
    ...restInput,
    name
  }

  return (
    <FormControl {...formControlProps} error={showError} style={style}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Select
        classes={classes}
        inputProps={inputProps}
        onChange={onChange}
        renderValue={renderValue}
        value={value}
        {...rest}
      />
      <OnChange name={name}>
        {async (value) => {
          fieldMutator && fieldMutator(trimSpaces(value))
        }}
      </OnChange>
      {showError && <FormHelperText>{meta.error || meta.submitError}</FormHelperText>}
    </FormControl>
  )
}

export default SelectInput
