import { getAnciliaAPI } from '@src/utils/ancilia'

export const ICX_TOKEN_ADDRESS = 'cx0000000000000000000000000000000000000000'
export const ICX_TOKEN_DECIMALS = 18
export const ICX_TOKEN_SYMBOL = 'ICX'

export const isTokenICX = (token) => {
  return token === ICX_TOKEN_ADDRESS
}

export const isICONContractAddress = function (address) {
  // check if it has the basic requirements of an address
  if (!/^(cx)?[0-9a-f]{40}$/i.test(address)) {
    return false
  }

  return true
}

export const isICONAddress = function (address) {
  // check if it has the basic requirements of an address
  if (!/^(hx|cx)?[0-9a-f]{40}$/i.test(address)) {
    return false
  }

  return true
}

export const displayBigInt = (balance) => {
  return parseFloat(balance.toFixed(18)).toString()
}

export const displayUnit = (amount, decimals) => {
  const ancilia = getAnciliaAPI()
  const balance = ancilia.convertDecimalsToUnit(amount, decimals)
  return displayBigInt(balance)
}

export const getTokenSymbol = (token) => {
  const ancilia = getAnciliaAPI()
  return token === ICX_TOKEN_ADDRESS
    ? ICX_TOKEN_SYMBOL : ancilia.irc2Symbol(token)
}

export const getTokenDecimals = async (token) => {
  const ancilia = getAnciliaAPI()
  return token === ICX_TOKEN_ADDRESS
    ? ICX_TOKEN_DECIMALS : await ancilia.irc2Decimals(token)
}

export const getTokenBalance = (address, token) => {
  const ancilia = getAnciliaAPI()
  return token === ICX_TOKEN_ADDRESS
    ? ancilia.icxBalance(address) : ancilia.irc2Balance(address, token)
}

export const convertTsToDateString = (timestamp) => {
  function pad (n) { return n < 10 ? '0' + n : n }

  var a = convertTsToDate(timestamp)
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  var year = a.getFullYear()
  var month = months[a.getMonth()]
  var date = pad(a.getDate())
  var hour = pad(a.getHours())
  var min = pad(a.getMinutes())
  var sec = pad(a.getSeconds())
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
  return time
}

export const convertTsToDate = (timestamp) => {
  return new Date(parseInt(timestamp) / 1000)
}
