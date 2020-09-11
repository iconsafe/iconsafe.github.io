import * as React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

import TextField from '@components/core/TextField'
import { composeValidators, required } from '@components/core/validator'
import { trimSpaces } from '@src/utils/strings'

const TextInput = ({
  className = '',
  name = 'TextInput',
  text = '',
  placeholder = '',
  fieldMutator,
  testId,
  inputAdornment,
  validators = [],
  defaultValue,
  disabled,
  isRequired
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
        placeholder={placeholder}
        text={text}
        type='text'
        validate={isRequired ? composeValidators(required, ...validators) : composeValidators(...validators)}
      />
      <OnChange name={name}>
        {async (value) => {
          fieldMutator(trimSpaces(value))
        }}
      </OnChange>
    </>
  )

export default TextInput
