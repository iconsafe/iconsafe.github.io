import {
  WALLET_CONNECTED_ACTION,
  WALLET_PROVIDER_ACTION,
  NETWORK_CONNECTED_ACTION
} from '@store/actions/actionTypes'

import { IconNetworks } from '@src/SCORE/Ancilia'

const initialState = {
  walletConnected: null,
  walletProvider: null,
  networkConnected: IconNetworks.LOCALHOST
}

function rootReducer (state = initialState, action) {
  switch (action.type) {
    case WALLET_CONNECTED_ACTION:
      return { ...state, walletConnected: action.walletConnected }
    case WALLET_PROVIDER_ACTION:
      return { ...state, walletProvider: action.walletProvider }
    case NETWORK_CONNECTED_ACTION:
      return { ...state, networkConnected: action.networkConnected }
    default:
      return state
  }
}
export default rootReducer
