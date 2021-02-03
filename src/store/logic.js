
import { getTokenSymbol, getTokenDecimals, ICX_TOKEN_ADDRESS, ZERO } from '@src/utils/icon'
import { IconConverter } from 'icon-sdk-js'
import * as dispatchers from '@src/store/actions'

export const refreshMultisigBalances = (msw, domainNames) =>
  async (dispatch, getState) => {
    const getAssetInformation = (token) => {
      return Promise.all([
        getTokenSymbol(token),
        msw.get_token_balance_history(token),
        getTokenDecimals(token)
      ]).then(([symbol, balanceHistory, decimals]) => {
        const balance = balanceHistory.length > 0 ? balanceHistory[0].balance : ZERO
        const result = {
          token: token,
          symbol: symbol,
          balance: balance,
          decimals: decimals,
          value: '? USD' // `${(balance * Math.random() / 1000000000000000000).toFixed(2)} USD` // todo
        }

        if (token === ICX_TOKEN_ADDRESS && domainNames) {
          // Stake && unstake
          return msw.getStake(domainNames.TRANSACTION_MANAGER_PROXY).then(stake => {
            const staked = stake.staked ? IconConverter.toBigNumber(stake.staked) : ZERO
            const unstaking = stake.unstaking ? IconConverter.toBigNumber(stake.unstaking) : ZERO
            const available = balance.minus(staked).minus(unstaking)
            result.iiss = {
              staked: staked,
              available: available,
              unstaking: unstaking
            }
            return result
          })
        } else {
          return result
        }
      })
    }
    Promise.all([msw.get_balance_trackers()]).then(([tokens]) => {
      Promise.all(tokens.map(tracker => getAssetInformation(tracker)))
        .then(multisigBalances => {
          dispatch(dispatchers.setMultisigBalances(multisigBalances))
        })
    })
  }
