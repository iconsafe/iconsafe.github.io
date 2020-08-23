import {
  WALLET_CONNECTED_ACTION,
  WALLET_PROVIDER_ACTION,
  NETWORK_CONNECTED_ACTION
} from './actionTypes'

export const setWalletConnected = (walletConnected) => ({ type: WALLET_CONNECTED_ACTION, walletConnected })
export const setWalletProvider = (walletProvider) => ({ type: WALLET_PROVIDER_ACTION, walletProvider })
export const setNetworkConnected = (networkConnected) => ({ type: NETWORK_CONNECTED_ACTION, networkConnected })
