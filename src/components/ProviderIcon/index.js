import trezorIcon from './icons/trezor.svg'
import ledgerIcon from './icons/ledger.svg'
import keystoreIcon from './icons/keystore.svg'
import IconexIcon from './icons/iconex.svg'
import magicIcon from './icons/magic.svg'
import { WALLET_PROVIDER } from '@src/SCORE/Ancilia'

const ICONS = {

  [WALLET_PROVIDER.TREZOR]: {
    src: trezorIcon,
    height: 25
  },
  [WALLET_PROVIDER.LEDGER]: {
    src: ledgerIcon,
    height: 25
  },
  [WALLET_PROVIDER.MAGIC]: {
    src: magicIcon,
    height: 25
  },
  [WALLET_PROVIDER.KEYSTORE]: {
    src: keystoreIcon,
    height: 25
  },
  [WALLET_PROVIDER.ICONEX]: {
    src: IconexIcon,
    height: 25
  }

}

export const getProviderIcon = (provider) => {
  return ICONS[provider.toUpperCase()]
}
