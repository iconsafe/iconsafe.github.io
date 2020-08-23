import IcxIcon from './icons/icx.svg'
import TapIcon from './icons/tap.png'
import UnknownIcon from './icons/unknown.png'

const TOKENS = {
  ICX: {
    src: IcxIcon,
    height: 25
  },
  TAP: {
    src: TapIcon,
    height: 25
  },
  UNKNOWN: {
    src: UnknownIcon,
    height: 25
  }
}

export const getTokenIcon = (tokens) => {
  if (tokens.toUpperCase() in TOKENS) {
    return TOKENS[tokens.toUpperCase()]
  } else {
    return TOKENS.UNKNOWN
  }
}
