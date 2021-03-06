import { Ancilia } from './Ancilia'
import { IconConverter } from 'icon-sdk-js'

export const BALANCED_SCORES = {
  "loans": "cx66d4d90f5f113eba575bf793570135f9b10cece1",
  "staking": "cx43e2eec79eb76293c298f2b17aec06097be606e0",
  "dividends": "cx13f08df7106ae462c8358066e6d47bb68d995b6d",
  "reserve": "cxf58b9a1898998a31be7f1d99276204a3333ac9b3",
  "daofund": "cx835b300dcfe01f0bdb794e134a0c5628384f4367",
  "rewards": "cx10d59e8103ab44635190bd4139dbfd682fa2d07e",
  "dex": "cxa0af3165c08318e988cb30993b3048335b94af6c",
  "governance": "cx44250a12074799e26fdeee75648ae47e2cc84219",
  "oracle": "cxe647e0af68a4661566f5e9861ad4ac854de808a2",
  "sicx": "cx2609b924e33ef00b648a409245c7ea394c467824",
  "bnUSD": "cx88fd7df7ddff82f7cc735c871dc519838cb235bb",
  "baln": "cxf61cd5a45dc9f91c15aa65831a30a90d59a09619",
  "bwt": "cxcfe9d1f83fa871e903008471cca786662437e58d",
}

export const BALANCED_TOKENS = {
  "cx88fd7df7ddff82f7cc735c871dc519838cb235bb": "bnUSD",
  "cx2609b924e33ef00b648a409245c7ea394c467824": "sICX",
  "cxf61cd5a45dc9f91c15aa65831a30a90d59a09619": "BALN",
}

export class Balanced extends Ancilia {

  constructor(network) {
    super(network)
  }

  getBalnHolding (_holder) {
    return this.__callROTx(BALANCED_SCORES['rewards'], 'getBalnHolding', {
      _holder: _holder
    }).then(result => IconConverter.toBigNumber(result))
  }

  balnStakedBalanceOf (_owner) {
    return this.__callROTx(BALANCED_SCORES['baln'], 'stakedBalanceOf', {
      _owner: _owner
    }).then(result => IconConverter.toBigNumber(result))
  }
  balnUnstakedBalanceOf (_owner) {
    return this.__callROTx(BALANCED_SCORES['baln'], 'unstakedBalanceOf', {
      _owner: _owner
    }).then(result => IconConverter.toBigNumber(result))
  }
  balnAvailableBalanceOf (_owner) {
    return this.__callROTx(BALANCED_SCORES['baln'], 'availableBalanceOf', {
      _owner: _owner
    }).then(result => IconConverter.toBigNumber(result))
  }
}