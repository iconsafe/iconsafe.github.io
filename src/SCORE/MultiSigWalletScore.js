import { Ancilia, IconNetworks } from './Ancilia'
import { IconConverter } from 'icon-sdk-js'

const NETWORK = IconNetworks.LOCALHOST
const MSW_SCORE = 'cx351ba692d5d29c5d579741e1541d75a45365d8e8'

// EventLogs
const TransactionCreated = 'TransactionCreated(int)'
const TransactionConfirmed = 'TransactionConfirmed(int,int)'
const TransactionRevoked = 'TransactionRevoked(int)'

// --- Objects ---
class BalanceHistory {
  constructor(json) {
    this.uid = parseInt(json.uid)
    this.token = json.token
    this.balance = IconConverter.toBigNumber(json.balance)
    this.txhash = json.txhash
    this.timestamp = parseInt(json.timestamp)
  }
}

class Transaction {
  constructor(json) {
    this.uid = parseInt(json.uid)
    this.destination = json.destination
    this.method_name = json.method_name
    this.params = json.params ? JSON.parse(json.params) : {}
    this.amount = IconConverter.toBigNumber(json.amount)
    this.description = json.description
    this.confirmations = parseInt(json.confirmations)
    this.state = json.state
  }
}

class WalletOwner {
  constructor(json) {
    this.uid = parseInt(json.uid)
    this.address = json.address
    this.name = json.name
  }
}

export class MultiSigWalletScore extends Ancilia {
  constructor(network, scoreAddress) {
    super(network)
    this._scoreAddress = scoreAddress
  }

  // -- BalanceHistoryManager ---
  get_balance_history (balance_history_uid) {
    return this.__callROTx(this._scoreAddress, 'get_balance_history', {
      balance_history_uid: IconConverter.toHex(balance_history_uid)
    }).then(json => {
      return new BalanceHistory(json)
    })
  }

  get_balance_trackers () {
    return this.__callROTx(this._scoreAddress, 'get_balance_trackers', {
    }).then(json => {
      return json
    })
  }

  get_token_balance_history (token, offset) {
    return this.__callROTx(this._scoreAddress, 'get_token_balance_history', {
      token: token,
      offset: IconConverter.toHex(offset)
    }).then(jsons => {
      return jsons.map(json => {
        return new BalanceHistory(json)
      })
    })
  }

  add_balance_tracker (token) {
    const wallet = this.getLoggedInWallet()

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'add_balance_tracker',
      0,
      { token: token }
    )
  }

  remove_balance_tracker (token) {
    const wallet = this.getLoggedInWallet()

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'remove_balance_tracker',
      0,
      { token: token }
    )
  }

  // --- TransactionManager ---
  submit_transaction (destination, method_name, params, amount, description) {
    const wallet = this.getLoggedInWallet()
    var method_params = {}

    method_params.destination = destination
    if (method_name) method_params.method_name = method_name
    if (params) method_params.params = JSON.stringify(params)
    if (amount) method_params.amount = IconConverter.toHex(amount)
    if (description) method_params.description = description

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'submit_transaction',
      amount,
      method_params
    ).then(async tx => {
      return this.getEventLog(tx.result, TransactionCreated).then(eventLog => {
        return {
          transaction_uid: parseInt(eventLog.indexed[1], 16)
        }
      })
    })
  }

  confirm_transaction (transaction_uid) {
    const wallet = this.getLoggedInWallet()

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'confirm_transaction',
      0,
      { transaction_uid: IconConverter.toHex(transaction_uid) }
    ).then(async tx => {
      return this.getEventLog(tx.result, TransactionConfirmed).then(eventLog => {
        return {
          transaction_uid: parseInt(eventLog.indexed[1], 16)
        }
      })
    })
  }

  revoke_transaction (transaction_uid) {
    const wallet = this.getLoggedInWallet()

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'revoke_transaction',
      0,
      { transaction_uid: IconConverter.toHex(transaction_uid) }
    ).then(async tx => {
      return this.getEventLog(tx.result, TransactionRevoked).then(eventLog => {
        return {
          transaction_uid: parseInt(eventLog.indexed[1], 16),
          wallet_owner_uid: parseInt(eventLog.indexed[2], 16)
        }
      })
    })
  }

  get_transaction (transaction_uid) {
    return this.__callROTx(this._scoreAddress, 'get_transaction', {
      transaction_uid: IconConverter.toHex(transaction_uid)
    }).then(json => {
      return new Transaction(json)
    })
  }

  get_waiting_transactions_count () {
    return this.__callROTx(this._scoreAddress, 'get_waiting_transactions_count').then(result => {
      return parseInt(result)
    })
  }

  get_executed_transactions_count () {
    return this.__callROTx(this._scoreAddress, 'get_executed_transactions_count').then(result => {
      return parseInt(result)
    })
  }

  get_waiting_transactions (offset) {
    return this.__callROTx(this._scoreAddress, 'get_waiting_transactions', {
      offset: IconConverter.toHex(offset)
    }).then(jsons => {
      return jsons.map(json => {
        return new Transaction(json)
      })
    })
  }

  get_executed_transactions (offset) {
    return this.__callROTx(this._scoreAddress, 'get_executed_transactions', {
      offset: IconConverter.toHex(offset)
    }).then(jsons => {
      return jsons.map(json => {
        return new Transaction(json)
      })
    })
  }

  // --- WalletOwnerManager ---
  get_wallet_owners (offset) {
    return this.__callROTx(this._scoreAddress, 'get_wallet_owners', {
      offset: IconConverter.toHex(offset)
    }).then(jsons => {
      return jsons.map(json => {
        return new WalletOwner(json)
      })
    })
  }

  get_wallet_owner (wallet_owner_uid) {
    return this.__callROTx(this._scoreAddress, 'get_wallet_owner', {
      wallet_owner_uid: IconConverter.toHex(wallet_owner_uid)
    }).then(json => {
      return new WalletOwner(json)
    })
  }

  get_wallet_owner_uid (address) {
    return this.__callROTx(this._scoreAddress, 'get_wallet_owner_uid',
      { address: address }
    ).then(result => {
      return parseInt(result)
    })
  }

  get_wallet_owners_count () {
    return this.__callROTx(this._scoreAddress, 'get_wallet_owners_count').then(result => {
      return parseInt(result)
    })
  }

  is_wallet_owner (address) {
    return this.__callROTx(this._scoreAddress, 'is_wallet_owner',
      { address: address }
    ).then(result => {
      return parseInt(result) !== 0
    })
  }

  get_wallet_owners_required () {
    return this.__callROTx(this._scoreAddress, 'get_wallet_owners_required').then(result => {
      return parseInt(result)
    })
  }
}
