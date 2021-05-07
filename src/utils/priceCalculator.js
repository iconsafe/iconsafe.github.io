import { getAnciliaAPI } from '@src/utils/ancilia'
import { BALANCED_SCORES } from '@src/SCORE/Balanced'

const icxCalculator = async (token) => {
  try {
    const response = await fetch(priceEndpoints[token].endpoint)
    const responseBody = await response.json()
    return responseBody.lastPrice.substring(0, 5)
  } catch (error) {
    return '?'
  }
}

const balnCalculator = async (token) => {
  try {
    const response = await getAnciliaAPI().__callROTx(BALANCED_SCORES.dex, 'getBalnPrice')
    return (parseInt(response) * Math.pow(10, -18)).toFixed(2).toString()
  } catch (error) {
    return '?'
  }
}

const bnUsdCalculator = async (token) => {
  // Complex logic
  return '1'
}

const priceEndpoints = {
  cx0000000000000000000000000000000000000000: { // ICX
    endpoint: 'https://api.binance.com/api/v3/ticker/24hr?symbol=ICXUSDT',
    calculator: icxCalculator
  },
  cxf61cd5a45dc9f91c15aa65831a30a90d59a09619: { // BALN Mainnet
    endpoint: '',
    calculator: balnCalculator
  },
  cx88fd7df7ddff82f7cc735c871dc519838cb235bb: { // bnUSD Mainnet
    endpoint: '',
    calculator: bnUsdCalculator
  },
}

export const tokenPriceCalculator = async (token) => {
  if (priceEndpoints[token] === undefined || priceEndpoints[token].endpoint === undefined) {
    return '?'
  }

  return priceEndpoints[token].calculator(token)
}
