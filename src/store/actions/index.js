import {
  WALLET_CONNECTED_ACTION,
  WALLET_PROVIDER_ACTION,
  NETWORK_CONNECTED_ACTION
} from './actionTypes'

export const setWalletConnected = (mode) => ({ type: WALLET_CONNECTED_ACTION, mode })
export const setWalletProvider = (mode) => ({ type: WALLET_PROVIDER_ACTION, mode })
export const setNetworkConnected = (mode) => ({ type: NETWORK_CONNECTED_ACTION, mode })
