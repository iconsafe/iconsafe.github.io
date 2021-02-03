import memoize from 'lodash.memoize'
import { getSymbolAndDecimalsFromContract, getNameFromContract } from '@src/utils/ancilia'
import { isICONContractAddress, isICONAddress } from '@src/utils/icon'

export const required = (value) => {
  const required = 'Required'

  if (!value) {
    return required
  }

  if (typeof value === 'string' && !value.trim().length) {
    return required
  }

  return undefined
}

export const mustBeICONContractAddress = memoize(
  (address) => {
    const isAddress = isICONContractAddress(address)
    return isAddress ? undefined : 'Address should be a valid ICON contract address'
  }
)

export const mustBeIRC2ContractAddress = memoize(
  async (address) => {
    const info = await getSymbolAndDecimalsFromContract(address)
    return info ? undefined : 'Address should be a valid ICON IRC2 token'
  }
)

export const mustBeSafeContractAddress = memoize(
  async (address) => {
    const info = await getNameFromContract(address)
    return info === 'ICONSafe' ? undefined : 'Address should be a valid ICONSafe contract'
  }
)

export const mustBeICONAddress = memoize(
  (address) => {
    const isAddress = isICONAddress(address)
    return isAddress ? undefined : 'Address should be a valid ICON address'
  }
)

export const mustBeInteger = (value) =>
  !Number.isInteger(Number(value)) || value.includes('.') ? 'Must be an integer' : undefined

export const mustBeFloat = (value) =>
  value && Number.isNaN(Number(value)) ? 'Must be a number' : undefined

const regexQuery = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
const url = new RegExp(regexQuery)
export const mustBeUrl = (value) => {
  if (url.test(value)) {
    return undefined
  }

  return 'Please, provide a valid url'
}

export const minValue = (min, inclusive = true) => (value) => {
  if (Number.parseFloat(value) > Number(min) || (inclusive && Number.parseFloat(value) >= Number(min))) {
    return undefined
  }

  return `Should be greater than ${inclusive ? 'or equal to ' : ''}${min}`
}

export const maxValue = (max) => (value) => {
  if (!max || parseFloat(value) <= parseFloat(max.toString())) {
    return undefined
  }

  return `Maximum value is ${max}`
}

export const ok = () => undefined

export const minMaxLength = (minLen, maxLen) => (value) =>
  value.length >= +minLen && value.length <= +maxLen ? undefined : `Should be ${minLen} to ${maxLen} symbols`

export const ADDRESS_REPEATED_ERROR = 'Address already introduced'

export const uniqueAddress = (addresses) =>
  memoize(
    (value) => {
      const addressAlreadyExists = addresses.some((address) => value === address)
      return addressAlreadyExists ? ADDRESS_REPEATED_ERROR : undefined
    }
  )

export const composeValidators = (...validators) => (value) =>
  validators.reduce(
    (error, validator) => error || validator(value),
    undefined
  )

export const differentFrom = (diffValue) => (value) => {
  if (value === diffValue.toString()) {
    return `Value should be different than ${diffValue}`
  }

  return undefined
}

export const noErrorsOn = (name, errors) => errors[name] === undefined
