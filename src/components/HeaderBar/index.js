import React from 'react'
import Layout from './components/Layout'
import ConnectDetails from './components/ProviderDetails/ConnectDetails'
import UserDetails from './components/ProviderDetails/UserDetails'
import ProviderAccessible from './components/ProviderInfo/ProviderAccessible'
import ProviderDisconnected from './components/ProviderInfo/ProviderDisconnected'
import { useDispatch, useSelector } from 'react-redux'
import { setWalletConnected, setWalletProvider } from '@src/store/actions'

const HeaderBar = () => {
  const walletConnected = useSelector((state) => state.walletConnected)
  const walletProvider = useSelector((state) => state.walletProvider)
  const networkConnected = useSelector((state) => state.networkConnected)
  const dispatch = useDispatch()
  const loaded = !!walletConnected && !!walletProvider

  const handleDisconnect = () => {
    dispatch(setWalletConnected(null))
    dispatch(setWalletProvider(null))
  }

  const getProviderInfoBased = () => {
    if (!loaded) {
      return <ProviderDisconnected />
    }

    return <ProviderAccessible connected provider={walletProvider} network={networkConnected} userAddress={walletConnected} />
  }

  const getProviderDetailsBased = () => {
    if (!loaded) {
      return <ConnectDetails />
    }

    return (
      <UserDetails
        connected
        network={networkConnected}
        onDisconnect={handleDisconnect}
        provider={walletProvider}
        userAddress={walletConnected}
      />
    )
  }

  const info = getProviderInfoBased()
  const details = getProviderDetailsBased()

  return <Layout providerDetails={details} providerInfo={info} />
}

export default HeaderBar
