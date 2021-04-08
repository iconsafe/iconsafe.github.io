import { Ancilia } from './Ancilia'
import { IconConverter } from 'icon-sdk-js'

//  Exceptions
class InvalidTransactionType extends Error { }

// EventLogs
const TransactionCreated = 'TransactionCreated(int,int)'
const TransactionConfirmed = 'TransactionConfirmed(int,int)'
const TransactionRevoked = 'TransactionRevoked(int,int)'
const TransactionRejected = 'TransactionRejected(int,int)'
const TransactionCancelled = 'TransactionCancelled(int,int)'
const IScoreClaimed = 'IScoreClaimed(int,int)'
const IScoreClaimedV2 = 'IScoreClaimedV2(Address,int,int)'

// --- Objects ---
class BalanceHistory {
  constructor(json) {
    this.uid = parseInt(json.uid)
    this.token = json.token
    this.balance = IconConverter.toBigNumber(json.balance)
    this.timestamp = parseInt(json.timestamp)
    this.transaction_uid = parseInt(json.transaction_uid)
  }
}

class Transaction {
  constructor(json) {
    this.uid = parseInt(json.uid)
    this.type = json.type
    this.created_txhash = json.created_txhash === 'None' ? null : json.created_txhash
    this.created_timestamp = parseInt(json.created_timestamp)
  }
}

export class SubOutgoingTransaction {
  constructor(destination, method_name, params, amount, description) {
    this.destination = destination
    this.method_name = method_name
    this.params = params ? typeof (params) === 'string' ? JSON.parse(params) : params : null
    this.amount = IconConverter.toBigNumber(amount)
    this.description = description
  }

  static fromJson (json) {
    return new SubOutgoingTransaction(
      json.destination,
      json.method_name,
      json.params,
      json.amount,
      json.description
    )
  }

  serialize () {
    return SubOutgoingTransaction.serialize(
      this.destination,
      this.method_name,
      this.params,
      this.amount,
      this.description
    )
  }

  static serialize (destination, method_name, params, amount, description) {
    return {
      destination: destination,
      method_name: method_name,
      params: params ? JSON.stringify(params) : '',
      amount: IconConverter.toHex(amount),
      description: description
    }
  }
}

export class OutgoingTransaction extends Transaction {
  constructor(json) {
    super(json)
    this.confirmations = json.confirmations.map(uid => parseInt(uid))
    this.rejections = json.rejections.map(uid => parseInt(uid))
    this.type = json.type
    this.state = json.state
    this.sub_transactions = json.sub_transactions.map(subtx => {
      return SubOutgoingTransaction.fromJson(subtx)
    })
    this.executed_timestamp = parseInt(json.executed_timestamp)
    this.executed_txhash = json.executed_txhash === 'None' ? null : json.executed_txhash
  }

  static create (confirmations, rejections, state, sub_transactions, executed_timestamp, executed_txhash) {
    return {
      confirmations: confirmations,
      type: 'OUTGOING',
      rejections: rejections,
      state: state,
      sub_transactions: sub_transactions,
      executed_timestamp: executed_timestamp,
      executed_txhash: executed_txhash
    }
  }
}

class IncomingTransaction extends Transaction {
  constructor(json) {
    super(json)
    this.token = json.token
    this.source = json.source
    this.amount = IconConverter.toBigNumber(json.amount)
  }
}

class ClaimIscoreTransaction extends IncomingTransaction {
  constructor(json) {
    super(json)
    this.claimer_uid = json.claimer_uid
    this.iscore = IconConverter.toBigNumber(json.iscore)
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

  // --- VersionManager ---
  get_versions_number () {
    return this.__iconexCallROTx(this._scoreAddress, 'get_domain').then(domain => {
      const promises = Object.entries(domain).map(k => this.__iconexCallROTx(k[1], 'get_version_number'))
      return Promise.all(promises).then(result => {
        return Object.entries(domain).map(k => {
          const entry = result.shift()
          return [entry, k[0]]
        })
      })
    })
  }

  // --- SettingsManager ---
  get_safe_name () {
    return this.__iconexCallROTx(this._scoreAddress, 'get_safe_name')
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

  // --- AddressRegistrar ---
  resolve_many (names) {
    return this.__iconexCallROTx(this._scoreAddress, 'resolve_many', {
      names: names
    }).then(json => {
      return json
    })
  }

  resolve (name) {
    return this.__iconexCallROTx(this._scoreAddress, 'resolve', {
      name: name
    }).then(json => {
      return json
    })
  }

  // --- BalanceHistoryManager ---
  get_balance_history (balance_history_uid) {
    return this.__iconexCallROTx(this._scoreAddress, 'get_balance_history', {
      balance_history_uid: IconConverter.toHex(parseInt(balance_history_uid))
    }).then(json => {
      return new BalanceHistory(json)
    })
  }

  get_balance_trackers () {
    return this.__iconexCallROTx(this._scoreAddress, 'get_balance_trackers', {
    }).then(json => {
      return json
    })
  }

  get_token_balance_history (token, offset = 0) {
    return this.__iconexCallROTx(this._scoreAddress, 'get_token_balance_history', {
      token: token,
      offset: IconConverter.toHex(parseInt(offset))
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

      case 'CLAIM_ISCORE':
        return new ClaimIscoreTransaction(json)

      default:
        throw new InvalidTransactionType(baseTransaction.type)
    }
  }

  submit_transaction (sub_transactions) {
    const wallet = this.getLoggedInWallet(true).address

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'submit_transaction',
      0,
      { sub_transactions: JSON.stringify(sub_transactions) }
    ).then(tx => {
      return this.getEventLog(tx.result, TransactionCreated).then(eventLog => {
        return {
          transaction_uid: parseInt(eventLog.indexed[1], 16),
          wallet_owner_uid: parseInt(eventLog.data[0], 16)
        }
      }).catch((error) => {
        console.log('ERR SUBMIT:', error)
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
      { transaction_uid: IconConverter.toHex(parseInt(transaction_uid)) }
    ).then(tx => {
      return this.getEventLog(tx.result, TransactionConfirmed).then(eventLog => {
        return {
          transaction_uid: parseInt(eventLog.indexed[1], 16)
        }
      }).catch((error) => {
        console.log('ERR CONFIRM:', error)
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
      { transaction_uid: IconConverter.toHex(parseInt(transaction_uid)) }
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
      { transaction_uid: IconConverter.toHex(parseInt(transaction_uid)) }
    ).then(tx => {
      return this.getEventLog(tx.result, TransactionRevoked).then(eventLog => {
        return {
          transaction_uid: parseInt(eventLog.indexed[1], 16),
          wallet_owner_uid: parseInt(eventLog.indexed[2], 16)
        }
      })
    })
  }

  cancel_transaction (transaction_uid) {
    const wallet = this.getLoggedInWallet(true).address

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'cancel_transaction',
      0,
      { transaction_uid: IconConverter.toHex(parseInt(transaction_uid)) }
    ).then(tx => {
      return this.getEventLog(tx.result, TransactionCancelled).then(eventLog => {
        return {
          transaction_uid: parseInt(eventLog.indexed[1], 16),
          wallet_owner_uid: parseInt(eventLog.data[0], 16)
        }
      })
    })
  }

  claim_iscore () {
    const wallet = this.getLoggedInWallet(true).address

    return this.__iconexCallRWTx(
      wallet,
      this._scoreAddress,
      'claim_iscore',
      0,
      {}
    ).then(tx => {
      return this.getEventLog(tx.result, IScoreClaimedV2).then(eventLog => {
        return {
          address: eventLog.indexed[1],
          iscore: IconConverter.toBigNumber(eventLog.data[0]),
          icx: IconConverter.toBigNumber(eventLog.data[1])
        }
      }).catch((error => {
        return this.getEventLog(tx.result, IScoreClaimed).then(eventLog => {
          return {
            iscore: IconConverter.toBigNumber(eventLog.indexed[1]),
            icx: IconConverter.toBigNumber(eventLog.indexed[2])
          }
        })
      }))
    })
  }

  get_transaction (transaction_uid) {
    return this.__iconexCallROTx(
      this._scoreAddress,
      'get_transaction',
      { transaction_uid: IconConverter.toHex(parseInt(transaction_uid)) }
    ).then(json => {
      return this.parseTransaction(json)
    })
  }

  get_waiting_transactions_count () {
    return this.__iconexCallROTx(this._scoreAddress, 'get_waiting_transactions_count').then(result => {
      return parseInt(result)
    })
  }

  get_all_transactions_count () {
    return this.__iconexCallROTx(this._scoreAddress, 'get_all_transactions_count').then(result => {
      return parseInt(result)
    })
  }

  get_executed_transactions_count () {
    return this.__iconexCallROTx(this._scoreAddress, 'get_executed_transactions_count').then(result => {
      return parseInt(result)
    })
  }

  get_waiting_transactions (offset) {
    return this.__iconexCallROTx(this._scoreAddress, 'get_waiting_transactions', {
      offset: IconConverter.toHex(parseInt(offset))
    }).then(jsons => {
      return jsons.map(json => {
        return this.parseTransaction(json)
      })
    })
  }

  get_all_transactions (offset) {
    return this.__iconexCallROTx(this._scoreAddress, 'get_all_transactions', {
      offset: IconConverter.toHex(parseInt(offset))
    }).then(jsons => {
      return jsons.map(json => {
        return this.parseTransaction(json)
      })
    })
  }

  get_executed_transactions (offset) {
    return this.__iconexCallROTx(this._scoreAddress, 'get_executed_transactions', {
      offset: IconConverter.toHex(parseInt(offset))
    }).then(jsons => {
      return jsons.map(json => {
        return this.parseTransaction(json)
      })
    })
  }

  // --- WalletOwnerManager ---
  get_wallet_owners (offset) {
    return this.__iconexCallROTx(this._scoreAddress, 'get_wallet_owners', {
      offset: IconConverter.toHex(parseInt(offset))
    }).then(jsons => {
      return jsons.map(json => {
        return new WalletOwner(json)
      })
    })
  }

  get_wallet_owner (wallet_owner_uid) {
    return this.__iconexCallROTx(this._scoreAddress, 'get_wallet_owner', {
      wallet_owner_uid: IconConverter.toHex(parseInt(wallet_owner_uid))
    }).then(json => {
      return new WalletOwner(json)
    })
  }

  get_wallet_owner_uid (address) {
    return this.__iconexCallROTx(this._scoreAddress, 'get_wallet_owner_uid',
      { address: address }
    ).then(result => {
      return parseInt(result)
    })
  }

  get_wallet_owners_count () {
    return this.__iconexCallROTx(this._scoreAddress, 'get_wallet_owners_count').then(result => {
      return parseInt(result)
    })
  }

  is_wallet_owner (address) {
    return this.__iconexCallROTx(this._scoreAddress, 'is_wallet_owner',
      { address: address }
    ).then(result => {
      return parseInt(result) !== 0
    })
  }

  get_wallet_owners_required () {
    return this.__iconexCallROTx(this._scoreAddress, 'get_wallet_owners_required').then(result => {
      return parseInt(result)
    })
  }

  set_wallet_owners_required (owners_required) {
    const sub_transactions = []
    sub_transactions.push(SubOutgoingTransaction.serialize(
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
    sub_transactions.push(SubOutgoingTransaction.serialize(
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
    sub_transactions.push(SubOutgoingTransaction.serialize(
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

  replace_wallet_owner (old_wallet_owner_uid, new_address, new_name) {
    const sub_transactions = []
    sub_transactions.push(SubOutgoingTransaction.serialize(
      this._scoreAddress,
      'replace_wallet_owner',
      [
        {
          name: 'old_wallet_owner_uid',
          type: 'int',
          value: IconConverter.toHex(parseInt(old_wallet_owner_uid))
        },
        {
          name: 'new_address',
          type: 'Address',
          value: new_address
        },
        {
          name: 'new_name',
          type: 'str',
          value: new_name
        }
      ],
      0,
      `Replace or edit an owner (UID=${old_wallet_owner_uid}) with the following information : name = ${new_name}, address = ${new_address} `
    ))

    return this.submit_transaction(sub_transactions)
  }

  // --- Event Manager ---
  get_events (offset = 0) {
    return this.__iconexCallROTx(
      this._scoreAddress,
      'get_events',
      { offset: IconConverter.toHex(parseInt(offset)) }
    ).then(result => {
      return result.map(event => {
        return {
          uid: parseInt(event.uid),
          hash: event.hash
        }
      })
    })
  }
}
