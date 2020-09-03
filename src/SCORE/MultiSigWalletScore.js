import { Ancilia } from './Ancilia'
import { IconConverter } from 'icon-sdk-js'

//  Exceptions
class InvalidTransactionType extends Error { }

// EventLogs
const TransactionCreated = 'TransactionCreated(int)'
const TransactionRejected = 'TransactionRejected(int,int)'
const TransactionConfirmed = 'TransactionConfirmed(int,int)'
const TransactionRevoked = 'TransactionRevoked(int)'

// --- Objects ---
class BalanceHistory {
  constructor (json) {
    this.uid = parseInt(json.uid)
    this.token = json.token
    this.balance = IconConverter.toBigNumber(json.balance)
    this.timestamp = parseInt(json.timestamp)
    this.transaction_uid = parseInt(json.transaction_uid)
  }
}

class Transaction {
  constructor (json) {
    this.uid = parseInt(json.uid)
    this.type = json.type
    this.created_txhash = json.created_txhash === 'None' ? null : json.created_txhash
    this.created_timestamp = parseInt(json.created_timestamp)
  }
}

class SubOutgoingTransaction {
  constructor (json) {
    this.destination = json.destination
    this.method_name = json.method_name
    this.params = json.params ? JSON.parse(json.params) : {}
    this.amount = IconConverter.toBigNumber(json.amount)
    this.description = json.description
  }

  static create (destination, method_name, params, amount, description) {
    return {
      destination: destination,
      method_name: method_name,
      params: JSON.stringify(params),
      amount: IconConverter.toHex(amount),
      description: description
    }
  }
}

class OutgoingTransaction extends Transaction {
  constructor (json) {
    super(json)
    this.confirmations = json.confirmations.map(uid => parseInt(uid))
    this.rejections = json.rejections.map(uid => parseInt(uid))
    this.state = json.state
    this.sub_transactions = json.sub_transactions.map(subtx => {
      return new SubOutgoingTransaction(subtx)
    })
    this.executed_timestamp = parseInt(json.executed_timestamp)
    this.executed_txhash = json.executed_txhash === 'None' ? null : json.executed_txhash
  }
}

class IncomingTransaction extends Transaction {
  constructor (json) {
    super(json)
    this.token = json.token
    this.source = json.source
    this.amount = IconConverter.toBigNumber(json.amount)
  }
}

class WalletOwner {
  constructor (json) {
    this.uid = parseInt(json.uid)
    this.address = json.address
    this.name = json.name
  }
}

export class MultiSigWalletScore extends Ancilia {
  constructor (network, scoreAddress) {
    super(network)
    this._scoreAddress = scoreAddress
  }

  // --- VersionManager ---
  get_version_number () {
    return this.__callROTx(this._scoreAddress, 'get_version_number')
  }

  // --- SettingsManager ---
  get_safe_name () {
    return this.__callROTx(this._scoreAddress, 'get_safe_name')
  }

  set_safe_name (safe_name) {
    const wallet = this.getLoggedInWallet(true).address

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'set_safe_name',
      0,
      { safe_name: safe_name }
    )
  }

  // --- BalanceHistoryManager ---
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
    const wallet = this.getLoggedInWallet(true).address

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'add_balance_tracker',
      0,
      { token: token }
    )
  }

  remove_balance_tracker (token) {
    const wallet = this.getLoggedInWallet(true).address

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'remove_balance_tracker',
      0,
      { token: token }
    )
  }

  // --- TransactionManager ---
  parseTransaction (json) {
    const baseTransaction = new Transaction(json)
    switch (baseTransaction.type) {
      case 'OUTGOING':
        return new OutgoingTransaction(json)

      case 'INCOMING':
        return new IncomingTransaction(json)

      default:
        throw new InvalidTransactionType(baseTransaction.type)
    }
  }

  submit_transaction (sub_transactions) {
    const wallet = this.getLoggedInWallet(true).address
    console.log('JSON.stringify(sub_transactions)=', JSON.stringify(sub_transactions))

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'submit_transaction',
      0,
      { sub_transactions: JSON.stringify(sub_transactions) }
    ).then(tx => {
      return this.getEventLog(tx.result, TransactionCreated).then(eventLog => {
        return {
          transaction_uid: parseInt(eventLog.indexed[1], 16)
        }
      }).catch((error) => {
        console.log('ERR SUBMIT:', error)
        console.log('txsub=', tx)
      })
    })
  }

  confirm_transaction (transaction_uid) {
    const wallet = this.getLoggedInWallet(true).address

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'confirm_transaction',
      0,
      { transaction_uid: IconConverter.toHex(transaction_uid) }
    ).then(tx => {
      return this.getEventLog(tx.result, TransactionConfirmed).then(eventLog => {
        return {
          transaction_uid: parseInt(eventLog.indexed[1], 16)
        }
      }).catch((error) => {
        console.log('ERR CONFIRM:', error)
        console.log('txconf=', tx)
      })
    })
  }

  reject_transaction (transaction_uid) {
    const wallet = this.getLoggedInWallet(true).address

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'reject_transaction',
      0,
      { transaction_uid: IconConverter.toHex(transaction_uid) }
    ).then(tx => {
      return this.getEventLog(tx.result, TransactionRejected).then(eventLog => {
        return {
          transaction_uid: parseInt(eventLog.indexed[1], 16)
        }
      })
    })
  }

  revoke_transaction (transaction_uid) {
    const wallet = this.getLoggedInWallet(true).address

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'revoke_transaction',
      0,
      { transaction_uid: IconConverter.toHex(transaction_uid) }
    ).then(tx => {
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
      return this.parseTransaction(json)
    })
  }

  get_waiting_transactions_count () {
    return this.__callROTx(this._scoreAddress, 'get_waiting_transactions_count').then(result => {
      return parseInt(result)
    })
  }

  get_all_transactions_count () {
    return this.__callROTx(this._scoreAddress, 'get_all_transactions_count').then(result => {
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
        return this.parseTransaction(json)
      })
    })
  }

  get_all_transactions (offset) {
    return this.__callROTx(this._scoreAddress, 'get_all_transactions', {
      offset: IconConverter.toHex(offset)
    }).then(jsons => {
      return jsons.map(json => {
        return this.parseTransaction(json)
      })
    })
  }

  get_executed_transactions (offset) {
    return this.__callROTx(this._scoreAddress, 'get_executed_transactions', {
      offset: IconConverter.toHex(offset)
    }).then(jsons => {
      return jsons.map(json => {
        return this.parseTransaction(json)
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
      wallet_owner_uid: IconConverter.toHex(parseInt(wallet_owner_uid))
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

  set_wallet_owners_required (owners_required) {
    const sub_transactions = []
    sub_transactions.push(SubOutgoingTransaction.create(
      this._scoreAddress,
      'set_wallet_owners_required',
      [{
        name: 'owners_required',
        type: 'int',
        value: IconConverter.toHex(parseInt(owners_required))
      }],
      0,
      `Change safe owners requirement to ${owners_required}`
    ))

    return this.submit_transaction(sub_transactions)
  }

  add_wallet_owner (address, name) {
    const sub_transactions = []
    sub_transactions.push(SubOutgoingTransaction.create(
      this._scoreAddress,
      'add_wallet_owner',
      [
        {
          name: 'address',
          type: 'Address',
          value: address
        },
        {
          name: 'name',
          type: 'str',
          value: name
        }
      ],
      0,
      `Add a new safe owner (${name}): ${address}`
    ))

    return this.submit_transaction(sub_transactions)
  }

  remove_wallet_owner (wallet_owner_uid) {
    const sub_transactions = []
    sub_transactions.push(SubOutgoingTransaction.create(
      this._scoreAddress,
      'remove_wallet_owner',
      [
        {
          name: 'wallet_owner_uid',
          type: 'int',
          value: IconConverter.toHex(parseInt(wallet_owner_uid))
        }
      ],
      0,
      `Remove an existing owner (UID=${wallet_owner_uid})`
    ))

    return this.submit_transaction(sub_transactions)
  }
}
