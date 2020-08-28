import IconService, { IconConverter } from 'icon-sdk-js'

// ================================================
// Constants
const WALLET_LOCAL_STORAGE_KEY = '__Ancilia_WALLET_LOCAL_STORAGE_KEY'
const WALLET_LOCAL_STORAGE_PROVIDER = '__Ancilia_WALLET_LOCAL_STORAGE_PROVIDER'

export const IconNetworks = {
  LOCALHOST: 'LOCALHOST',
  MAINNET: 'MAINNET',
  EULJIRO: 'EULJIRO',
  YEOUIDO: 'YEOUIDO'
}

export const WALLET_PROVIDER = {
  LEDGER: 'LEDGER',
  TREZOR: 'TREZOR',
  ICONEX: 'ICONEX',
  KEYSTORE: 'KEYSTORE',
  MAGIC: 'MAGIC'
}

// ================================================
//  Exceptions
class UnconfirmedTransaction extends Error { }
class LoggedInCancelled extends Error { }
class WrongEventSignature extends Error { }
class NotLoggedInWallet extends Error { }

// ================================================
//  Ancilia Implementation
export class Ancilia {
  constructor (network) {
    this._nid = this.__getNetworkInfo(network).nid
    this._network = network
    this.recoverSession()
  }

  // Session ============================================================
  recoverSession () {
    if (this.isLoggedIn()) {
      this._walletAddress = this.getLoggedInWallet()
    }
  }

  login (provider) {
    switch (provider) {
      case WALLET_PROVIDER.ICONEX:
        return this.iconexAskAddress().then(address => {
          if (!address) throw new LoggedInCancelled()
          window.localStorage.setItem(WALLET_LOCAL_STORAGE_KEY, address)
          window.localStorage.setItem(WALLET_LOCAL_STORAGE_PROVIDER, WALLET_PROVIDER.ICONEX)
          this._walletAddress = address
          return address
        })

      default:
        throw new Error('UnsupportedWalletProvider')
    }
  }

  isLoggedIn () {
    const address = window.localStorage.getItem(WALLET_LOCAL_STORAGE_KEY)
    return address !== undefined && address !== null
  }

  getLoggedInWallet (shouldThrow = false) {
    if (!this.isLoggedIn()) {
      if (shouldThrow) {
        throw new NotLoggedInWallet()
      } else {
        return null
      }
    } else {
      return {
        address: window.localStorage.getItem(WALLET_LOCAL_STORAGE_KEY),
        provider: window.localStorage.getItem(WALLET_LOCAL_STORAGE_PROVIDER)
      }
    }
  }

  logout () {
    window.localStorage.removeItem(WALLET_LOCAL_STORAGE_KEY)
    window.localStorage.removeItem(WALLET_LOCAL_STORAGE_PROVIDER)
  }

  // Network Meta ============================================================
  getAPIEndpoint () {
    const apis = this.__getNetworkInfo(this._network).api
    return apis[Math.floor(Math.random() * apis.length)]
  }

  getTrackerEndpoint () {
    return this.__getNetworkInfo(this._network).tracker
  }

  getNetworkName () {
    return this.__getNetworkInfo(this._network).name
  }

  // ICX Interface ============================================================
  icxBalance (address) {
    // Assume ICX has 18 decimals
    return this.__getIconService().getBalance(address).execute().then(balance => {
      return IconConverter.toBigNumber(balance)
    })
  }

  // IRC2 Token Interface ============================================================
  irc2Decimals (contract) {
    return this.__callROTx(contract, 'decimals').then(decimals => {
      return parseInt(decimals)
    })
  }

  irc2Name (contract) {
    return this.__callROTx(contract, 'name')
  }

  irc2Symbol (contract) {
    return this.__callROTx(contract, 'symbol')
  }

  irc2Balance (address, contract) {
    return this.__callROTx(contract, 'balanceOf', { _owner: address }).then(balance => {
      return IconConverter.toBigNumber(balance)
    })
  }

  // Utils
  convertUnitToDecimals (amount, decimals) {
    return IconConverter.toBigNumber(amount).multipliedBy(IconConverter.toBigNumber('10').exponentiatedBy(decimals))
  }

  convertDecimalsToUnit (amount, decimals) {
    return IconConverter.toBigNumber(amount).dividedBy(IconConverter.toBigNumber('10').exponentiatedBy(decimals))
  }

  convertUnitToDecimalsEx (amount, contract) {
    return this.irc2Decimals(contract).then(decimals => {
      return this.convertUnitToDecimals(amount, decimals)
    })
  }

  convertDecimalsToUnitEx (amount, contract) {
    return this.irc2Decimals(contract).then(decimals => {
      return this.convertDecimalsToUnit(amount, decimals)
    })
  }

  // Event log
  getEventLog (txHash, eventLogSignature) {
    return this.txResult(txHash).then(txResult => {
      return this.extractEventLog(txResult.eventLogs, eventLogSignature)
    })
  }

  extractEventLog (eventLogs, eventLogSignature) {
    const eventLog = eventLogs.filter(eventLogs => {
      return eventLogs.indexed[0] === eventLogSignature
    })[0]

    if (eventLog === undefined) {
      throw new WrongEventSignature(eventLogs)
    }

    return eventLog
  }

  // ICONex Connect Extension =============================================================
  iconexHasAccount () {
    return this.__iconexConnectRequest('REQUEST_HAS_ACCOUNT')
  }

  iconexHasAddress (address) {
    return this.__iconexConnectRequest('REQUEST_HAS_ADDRESS', address)
  }

  iconexAskAddress () {
    return this.__iconexConnectRequest('REQUEST_ADDRESS')
  }

  iconexTransferIcx (to, amount) {
    return this.__iconexIcxTransferTx(this._walletAddress, to, amount)
  }

  iconexTransferIrc2 (to, contract, value, data = null) {
    var params = {
      _to: to,
      _value: IconConverter.toHex(value)
    }

    if (data) {
      // Optional data field
      params._data = IconConverter.toHex(JSON.stringify(data))
    }

    return this.__iconexCallRWTx(this._walletAddress, contract, 'transfer', 0, params)
  }

  // ======================================================================================
  // Following classes are private because they are lower level methods at a protocol level
  __iconexCallRWTxEx (from, to, method, value, stepLimit, params) {
    const transaction = this.__buildCallRWTx(from, to, method, value, stepLimit, params)
    const jsonRpcQuery = {
      jsonrpc: '2.0',
      method: 'icx_sendTransaction',
      params: IconConverter.toRawTransaction(transaction),
      id: 1234
    }
    return this.__iconexJsonRpc(jsonRpcQuery)
  }

  __iconexDeployTx (from, scoreFileBytes, scoreParams) {
    const transaction = this.__buildDeployTx(from, scoreFileBytes, scoreParams)
    const jsonRpcQuery = {
      jsonrpc: '2.0',
      method: 'icx_sendTransaction',
      params: IconConverter.toRawTransaction(transaction),
      id: 1234
    }
    return this.__iconexJsonRpc(jsonRpcQuery)
  }

  __iconexIcxTransferTx (from, to, value) {
    const transaction = this.__buildIcxTranferTx(from, to, value, 150000)
    const jsonRpcQuery = {
      jsonrpc: '2.0',
      method: 'icx_sendTransaction',
      params: IconConverter.toRawTransaction(transaction),
      id: 1234
    }
    // HACK FIX: https://github.com/icon-project/iconex_chrome_extension/issues/34
    jsonRpcQuery.params.data = ''
    return this.__iconexJsonRpc(jsonRpcQuery)
  }

  __iconexCallRWTx (from, to, method, value, params) {
    return this.__estimateStep(from, to, method, value, params).then(stepLimit => {
      return this.__iconexCallRWTxEx(from, to, method, value, stepLimit, params)
    })
  }

  __iconexConnectRequest (requestType, payload) {
    return new Promise((resolve, reject) => {
      function eventHandler (event) {
        const { payload } = event.detail
        window.removeEventListener('ICONEX_RELAY_RESPONSE', eventHandler)
        resolve(payload)
      }
      window.addEventListener('ICONEX_RELAY_RESPONSE', eventHandler)

      window.dispatchEvent(new window.CustomEvent('ICONEX_RELAY_REQUEST', {
        detail: {
          type: requestType,
          payload
        }
      }))
    })
  }

  __iconexJsonRpc (jsonRpcQuery) {
    return this.__iconexConnectRequest('REQUEST_JSON-RPC', jsonRpcQuery).then(payload => {
      return payload
    })
  }

  // ======================================================================================
  // Transaction Builders
  __buildCallRWTx (from, to, method, value, stepLimit, params = {}) {
    let callTransactionBuilder = new IconService.IconBuilder.CallTransactionBuilder()
      .from(from)
      .to(to)
      .value(IconConverter.toHex(value))
      .stepLimit(IconConverter.toBigNumber(stepLimit))
      .nid(IconConverter.toBigNumber(this._nid))
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3))
      .timestamp((new Date()).getTime() * 1000)
      .method(method)

    // Optional "params" field
    if (Object.keys(params).length !== 0) {
      callTransactionBuilder = callTransactionBuilder.params(params)
    }

    return callTransactionBuilder.build()
  }

  __buildIcxTranferTx (from, to, value, stepLimit) {
    return new IconService.IconBuilder.IcxTransactionBuilder()
      .to(to)
      .from(from)
      .value(IconConverter.toHex(value))
      .stepLimit(IconConverter.toBigNumber(stepLimit))
      .nid(IconConverter.toBigNumber(this._nid))
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3))
      .timestamp((new Date()).getTime() * 1000)
      .build()
  }

  __buildCallROTx (to, method, params = {}) {
    let callBuilder = new IconService.IconBuilder.CallBuilder()
      .from(null)
      .to(to)
      .method(method)

    // Optional "params" field
    if (Object.keys(params).length !== 0) {
      callBuilder = callBuilder.params(params)
    }

    return callBuilder.build()
  }

  __buildDeployTx (from, scoreFileBytes, params = {}) {
    let deployTransactionBuilder = new IconService.IconBuilder.DeployTransactionBuilder()
      .from(from)
      .to('cx0000000000000000000000000000000000000000')
      .stepLimit(IconConverter.toBigNumber(3000000000))
      .nid(IconConverter.toBigNumber(this._nid))
      .nonce(IconConverter.toBigNumber(1))
      .version(IconConverter.toBigNumber(3))
      .timestamp((new Date()).getTime() * 1000)
      .contentType('application/zip')
      .content(scoreFileBytes)

    // Optional "params" field
    if (Object.keys(params).length !== 0) {
      deployTransactionBuilder = deployTransactionBuilder.params(params)
    }

    return deployTransactionBuilder.build()
  }

  // ======================================================================================
  // Calling methods
  async txResult (txHash, retriesLeft = 1000, interval = 100) {
    try {
      return await this.__getIconService().getTransactionResult(txHash).execute()
    } catch (error) {
      if (retriesLeft) {
        await new Promise((resolve, reject) => setTimeout(resolve, interval))
        return this.txResult(txHash, retriesLeft - 1, interval)
      } else throw new UnconfirmedTransaction(txHash)
    }
  }

  __callROTx (to, method, params) {
    const transaction = this.__buildCallROTx(to, method, params)
    return this.__getIconService().call(transaction).execute()
  }

  // ======================================================================================
  // Debug API
  __estimateStep (from, to, method, value, params = {}) {
    const transaction = {
      jsonrpc: '2.0',
      method: 'debug_estimateStep',
      id: 1,
      params: {
        version: '0x3',
        from: from,
        to: to,
        value: IconConverter.toHex(IconConverter.toBigNumber(value)),
        timestamp: IconConverter.toHex((new Date()).getTime() * 1000),
        nid: IconConverter.toHex(IconConverter.toBigNumber(this._nid)),
        nonce: '0x1',
        dataType: 'call',
        data: {
          method: method,
          params: params
        }
      }
    }

    return new Promise((resolve, reject) => {
      try {
        const result = this.__getDebugIconService().provider.request(transaction).execute()
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }

  // ======================================================================================
  // Meta methods
  __getIconService () {
    return new IconService(new IconService.HttpProvider(this.getAPIEndpoint() + '/api/v3'))
  }

  __getDebugIconService () {
    return new IconService(new IconService.HttpProvider(this.getAPIEndpoint() + '/api/debug/v3'))
  }

  getCurrentNetworkInfo () {
    return this.__getNetworkInfo(this._network)
  }

  __getNetworkInfo (network) {
    const iconNetworksInfo = []
    iconNetworksInfo[IconNetworks.LOCALHOST] = {
      name: 'localhost',
      api: ['http://127.0.0.1:9000'],
      tracker: 'http://127.0.0.1:9000',
      nid: 0
    }
    iconNetworksInfo[IconNetworks.MAINNET] = {
      name: 'MainNet',
      api: ['https://ctz.solidwallet.io'],
      tracker: 'https://tracker.icon.foundation',
      nid: 1
    }
    iconNetworksInfo[IconNetworks.EULJIRO] = {
      name: 'Euljiro (TestNet)',
      api: ['https://test-ctz.solidwallet.io'],
      tracker: 'https://trackerdev.icon.foundation',
      nid: 2
    }
    iconNetworksInfo[IconNetworks.YEOUIDO] = {
      name: 'Yeouido (TestNet)',
      api: ['https://bicon.net.solidwallet.io'],
      tracker: 'https://bicon.tracker.solidwallet.io',
      nid: 3
    }
    return iconNetworksInfo[network]
  }
}
