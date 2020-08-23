// Icons
import trezorIcon from './icon-trezor.svg'
import ledgerIcon from './icon-ledger.svg'
import fortmaticIcon from './icon-fortmatic.svg'
import keystoreIcon from './icon-keystore.svg'
import IconexIcon from './icon-iconex.svg'
import magicIcon from './icon-magic.svg'
import { WALLET_PROVIDER } from '@src/SCORE/Ancilia'

const WALLET_ICONS = {
  [WALLET_PROVIDER.TREZOR]: {
    src: trezorIcon,
    height: 25
  },
  [WALLET_PROVIDER.LEDGER]: {
    src: ledgerIcon,
    height: 25
  },
  [WALLET_PROVIDER.FORTMATIC]: {
    src: fortmaticIcon,
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

export default WALLET_ICONS
