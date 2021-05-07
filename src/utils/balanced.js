import store from '@src/store'
import { Balanced } from '@src/SCORE/Balanced'

export const getBalancedAPI = () => {
  const networkConnected = store.getState().networkConnected
  return new Balanced(networkConnected)
}

