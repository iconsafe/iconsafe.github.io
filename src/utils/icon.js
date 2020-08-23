export const ICX_TOKEN_ADDRESS = 'cx0000000000000000000000000000000000000000'

export const isTokenICX = (token) => {
  return token === ICX_TOKEN_ADDRESS
}

export const displayBalance = (balance) => {
  return parseFloat(balance.toFixed(8)).toString()
}
