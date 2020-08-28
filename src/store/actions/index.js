import * as Actions from '@store/actions/actionTypes'

export const setWalletConnected = (walletConnected) => ({ type: Actions.WALLET_CONNECTED_ACTION, walletConnected })
export const setWalletProvider = (walletProvider) => ({ type: Actions.WALLET_PROVIDER_ACTION, walletProvider })
export const setWalletOwners = (walletOwners) => ({ type: Actions.WALLET_OWNERS_ACTION, walletOwners })
export const setWalletOwnersRequired = (walletOwnersRequired) => ({ type: Actions.WALLET_OWNERS_REQUIRED_ACTION, walletOwnersRequired })
export const setMultisigBalances = (multisigBalances) => ({ type: Actions.MULTISIG_BALANCES_ACTION, multisigBalances })
export const setForceReload = (forceReload) => ({ type: Actions.FORCE_RELOAD_ACTION, forceReload })
export const setConnectedWalletOwnerUid = (connectedWalletOwnerUid) => ({ type: Actions.CONNECTED_WALLET_WALLET_OWNER_UID, connectedWalletOwnerUid })
export const setNetworkConnected = (networkConnected) => ({ type: Actions.NETWORK_CONNECTED_ACTION, networkConnected })
