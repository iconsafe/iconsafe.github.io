import IcxIcon from './icons/icx.svg'
import TapIcon from './icons/tap.png'
import UnknownIcon from './icons/unknown.png'
import TokenPlaceholder from '@src/assets/icons/token_placeholder.svg'

const TOKENS = {
  ICX: {
    src: IcxIcon,
    height: 25
  },
  TAP: {
    src: TapIcon,
    height: 25
  },
  GENERIC_TOKEN: {
    src: TokenPlaceholder,
    height: 25
  },
  UNKNOWN: {
    src: UnknownIcon,
    height: 25
  }
}

export const getTokenIcon = (token) => {
  if (token && token.toUpperCase() in TOKENS) {
    return TOKENS[token.toUpperCase()]
  } else {
    return TOKENS.UNKNOWN
  }
}
