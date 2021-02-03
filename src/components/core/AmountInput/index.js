import * as React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

import TextField from '@components/core/TextField'
import { composeValidators, mustBeFloat, required } from '@components/core/validator'
import { trimSpaces } from '@src/utils/strings'

const AmountInput = ({
  className = '',
  name = 'ICXAmount',
  text = 'ICX Amount*',
  placeholder = 'ICX Amount*',
  fieldMutator,
  value,
  testId,
  inputAdornment,
  validators = [],
  defaultValue,
  disabled
}) =>
(
  <>
    <Field
      className={className}
      component={TextField}
      defaultValue={defaultValue}
      disabled={disabled}
      inputAdornment={inputAdornment}
      name={name}
      value={value}
      placeholder={placeholder}
      text={text}
      type='text'
      validate={composeValidators(required, mustBeFloat, ...validators)}
    />
    <OnChange name={name}>
      {async (value) => {
        const address = trimSpaces(value)
        fieldMutator(address)
      }}
    </OnChange>
  </>
)

export default AmountInput
