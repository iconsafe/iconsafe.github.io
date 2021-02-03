import * as Actions from '@store/actions/actionTypes'
import { isWalletOwner } from '@src/utils/msw'
import { IconNetworks } from '@src/SCORE/Ancilia'

const isDevelopment = process.env.NODE_ENV !== 'production'

const initialState = {
  walletConnected: null,
  domainNames: null,
  walletProvider: null,
  networkConnected: isDevelopment ? IconNetworks.LOCALHOST : IconNetworks.YEOUIDO,
  multisigBalances: null,
  connectedWalletOwnerUid: null,
  forceReload: true,
  walletOwnersRequired: 0,
  contractVersion: null,
  granted: false,
  safeAddress: null,
  latestTransactions: null,
  latestEvents: [],
  currentEvent: null
}

function rootReducer (state = initialState, action) {
  switch (action.type) {
    case Actions.WALLET_CONNECTED_ACTION:
      return {
        ...state,
        walletConnected: action.walletConnected,
        granted: isWalletOwner(action.walletConnected, state.walletOwners)
      }
    case Actions.WALLET_PROVIDER_ACTION:
      return { ...state, walletProvider: action.walletProvider }
    case Actions.DOMAIN_NAMES_ACTION:
      return { ...state, domainNames: action.domainNames }
    case Actions.WALLET_OWNERS_ACTION:
      return {
        ...state,
        walletOwners: action.walletOwners,
        granted: isWalletOwner(state.walletConnected, action.walletOwners)
      }
    case Actions.WALLET_OWNERS_REQUIRED_ACTION:
      return { ...state, walletOwnersRequired: action.walletOwnersRequired }
    case Actions.MULTISIG_BALANCES_ACTION:
      return { ...state, multisigBalances: action.multisigBalances }
    case Actions.FORCE_RELOAD_ACTION:
      return { ...state, forceReload: action.forceReload }
    case Actions.SAFE_ADDRESS_ACTION:
      return { ...state, safeAddress: action.safeAddress }
    case Actions.SAFE_NAME_ACTION:
      return { ...state, safeName: action.safeName }
    case Actions.CONNECTED_WALLET_OWNER_UID_ACTION:
      return { ...state, connectedWalletOwnerUid: action.connectedWalletOwnerUid }
    case Actions.CONNECTED_WALLET_OWNER_ACTION:
      return { ...state, connectedWalletOwner: action.connectedWalletOwner }
    case Actions.LATEST_TRANSACTIONS_ACTION:
      return { ...state, latestTransactions: action.latestTransactions }
    case Actions.NETWORK_CONNECTED_ACTION:
      return { ...state, networkConnected: action.networkConnected }
    case Actions.CONTRACT_VERSION_ACTION:
      return { ...state, contractVersion: action.contractVersion }
    case Actions.LATEST_EVENTS_ACTION: {
      return { ...state, latestEvents: action.latestEvents }
    } case Actions.CURRENT_EVENT_ACTION:
      return { ...state, currentEvent: action.currentEvent }
    default:
      return state
  }
}
export default rootReducer
