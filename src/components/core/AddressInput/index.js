import * as React from 'react'
import { Field } from 'react-final-form'
import { OnChange } from 'react-final-form-listeners'

import TextField from '@components/core/TextField'
import { composeValidators, mustBeICONAddress, required } from '@components/core/validator'
import { trimSpaces } from '@src/utils/strings'

// an idea for second field was taken from here
// https://github.com/final-form/react-final-form-listeners/blob/master/src/OnBlur.js

const AddressInput = ({
  className = '',
  name = 'recipientAddress',
  text = 'Recipient*',
  placeholder = 'Recipient*',
  fieldMutator,
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
        placeholder={placeholder}
        text={text}
        type='text'
        validate={composeValidators(required, mustBeICONAddress, ...validators)}
      />
      <OnChange name={name}>
        {async (value) => {
          const address = trimSpaces(value)
          fieldMutator(address)
        }}
      </OnChange>
    </>
  )

export default AddressInput
