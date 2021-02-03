import { Ancilia } from '@src/SCORE/Ancilia'
import store from '@src/store'

export const getAnciliaAPI = () => {
  const networkConnected = store.getState().networkConnected
  return new Ancilia(networkConnected)
}

export const getSymbolAndDecimalsFromContract = (tokenAddress) => {
  const ancilia = getAnciliaAPI()

  const promises = [ancilia.irc2Symbol(tokenAddress), ancilia.irc2Decimals(tokenAddress)]

  return Promise.all(promises).then(result => {
    return {
      symbol: result[0],
      decimals: parseInt(result[1])
    }
  }).catch(() => {
    return null
  })
}

export const getNameFromContract = (tokenAddress) => {
  const ancilia = getAnciliaAPI()

  const promises = [ancilia.getName(tokenAddress)]

  return Promise.all(promises).then(result => {
    return result[0]
  }).catch(() => {
    return null
  })
}
