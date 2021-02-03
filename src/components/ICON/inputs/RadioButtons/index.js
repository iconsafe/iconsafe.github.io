import React from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'

const RadioButtons = ({
  name,
  value,
  onRadioChange,
  options,
  ...rest
}) => {
  const onChangeInternal = (event) =>
    onRadioChange((event.target).value)

  return (
    <RadioGroup
      aria-label={name}
      name={name}
      value={value}
      onChange={onChangeInternal}
      {...rest}
    >
      {options.map((o) => (
        <FormControlLabel
          key={o.value}
          label={o.label}
          value={o.value}
          control={<Radio color='primary' />}
        />
      ))}
    </RadioGroup>
  )
}

export default RadioButtons
