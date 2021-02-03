const icxCalculator = async (token) => {
  try {
    const response = await fetch(priceEndpoints[token].endpoint)
    const responseBody = await response.json()
    return responseBody.lastPrice.substring(0, 5)
  } catch (error) {
    return '?'
  }
}

const tapCalculator = async (token) => {
  // Proof of Concept
  try {
    return '?'
  } catch (error) {
    return '?'
  }
}

const priceEndpoints = {
  cx0000000000000000000000000000000000000000: { // ICX
    endpoint: 'https://api.binance.com/api/v3/ticker/24hr?symbol=ICXUSDT',
    calculator: icxCalculator
  },
  cxc0b5b52c9f8b4251a47e91dda3bd61e5512cd782: { // TAP Mainnet
    endpoint: undefined,
    calculator: tapCalculator
  },
  cx9f59037c900880af1c96e6c3db137259360b33d4: { // TAP Yeouido
    endpoint: undefined,
    calculator: tapCalculator
  }
}

export const tokenPriceCalculator = async (token) => {
  if (priceEndpoints[token] === undefined || priceEndpoints[token].endpoint === undefined) {
    return '?'
  }

  return priceEndpoints[token].calculator(token)
}
