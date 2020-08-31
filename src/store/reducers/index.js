import * as Actions from '@store/actions/actionTypes'

import { IconNetworks } from '@src/SCORE/Ancilia'

const initialState = {
  walletConnected: null,
  walletProvider: null,
  networkConnected: IconNetworks.LOCALHOST,
  multisigBalances: null,
  connectedWalletOwnerUid: null,
  forceReload: true,
  walletOwnersRequired: 0,
  contractVersion: null
}

function rootReducer (state = initialState, action) {
  switch (action.type) {
    case Actions.WALLET_CONNECTED_ACTION:
      return { ...state, walletConnected: action.walletConnected }
    case Actions.WALLET_PROVIDER_ACTION:
      return { ...state, walletProvider: action.walletProvider }
    case Actions.WALLET_OWNERS_ACTION:
      return { ...state, walletOwners: action.walletOwners }
    case Actions.WALLET_OWNERS_REQUIRED_ACTION:
      return { ...state, walletOwnersRequired: action.walletOwnersRequired }
    case Actions.MULTISIG_BALANCES_ACTION:
      return { ...state, multisigBalances: action.multisigBalances }
    case Actions.FORCE_RELOAD_ACTION:
      return { ...state, forceReload: action.forceReload }
    case Actions.CONNECTED_WALLET_OWNER_UID_ACTION:
      return { ...state, connectedWalletOwnerUid: action.connectedWalletOwnerUid }
    case Actions.NETWORK_CONNECTED_ACTION:
      return { ...state, networkConnected: action.networkConnected }
    case Actions.CONTRACT_VERSION_ACTION:
      return { ...state, contractVersion: action.contractVersion }
    default:
      return state
  }
}
export default rootReducer
