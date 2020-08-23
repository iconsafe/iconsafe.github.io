import React from 'react'
import Layout from './components/Layout'
import ConnectDetails from './components/ProviderDetails/ConnectDetails'
import UserDetails from './components/ProviderDetails/UserDetails'
import ProviderAccessible from './components/ProviderInfo/ProviderAccessible'
import ProviderDisconnected from './components/ProviderInfo/ProviderDisconnected'
import { connect } from 'react-redux'
import { setWalletConnected, setWalletProvider } from '@src/store/actions'

const HeaderComponent = ({ available, loaded, provider, userAddress, network }) => {
  const handleDisconnect = () => {
    const { setWalletProvider, setWalletConnected } = this.props
    setWalletConnected(null)
    setWalletProvider(null)
  }

  const getProviderInfoBased = () => {
    if (!loaded) {
      return <ProviderDisconnected />
    }

    return <ProviderAccessible connected={available} provider={provider} network={network} userAddress={userAddress} />
  }

  const getProviderDetailsBased = () => {
    console.log(available, loaded, network, provider, userAddress)
    console.log(loaded)

    if (!loaded) {
      return <ConnectDetails />
    }

    return (
      <UserDetails
        connected={available}
        network={network}
        onDisconnect={handleDisconnect}
        provider={provider}
        userAddress={userAddress}
      />
    )
  }

  const info = getProviderInfoBased()
  const details = getProviderDetailsBased()

  return <Layout providerDetails={details} providerInfo={info} />
}

const mapStateToProps = state => {
  return {
    userAddress: state.walletConnected,
    provider: state.walletProvider,
    loaded: state.walletConnected !== null && state.walletProvider !== null,
    available: true,
    network: 'localhost'
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setWalletConnected: value => dispatch(setWalletConnected(value)),
    setWalletProvider: value => dispatch(setWalletProvider(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)
