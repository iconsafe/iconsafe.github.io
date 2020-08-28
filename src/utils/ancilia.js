import { Ancilia } from '@src/SCORE/Ancilia'
import store from '@src/store'

export const getAnciliaAPI = () => {
  const networkConnected = store.getState().networkConnected
  return new Ancilia(networkConnected)
}

export const getSymbolAndDecimalsFromContract = (tokenAddress) => {
  const ancilia = getAnciliaAPI()

  const promises = [ancilia.irc2Symbol(tokenAddress), ancilia.irc2Decimals(tokenAddress)]

  return Promise.allSettled(promises).then(result => {
    result = result.map(item => item.value)
    if (!result[0] || !result[1]) return null
    return {
      symbol: result[0],
      decimals: parseInt(result[1])
    }
  }).catch(() => {
    return null
  })
}
