import React from 'react'
import Img from '@components/core/Img'

import IcxIcon from './icons/icx.svg'
import TapIcon from './icons/tap.png'
import SportsIcon from './icons/sports.png'
import WokIcon from './icons/wok.png'
import Ac3Icon from './icons/ac3.png'
import uethIcon from './icons/ueth.png'
import metxIcon from './icons/metx.png'
import seedIcon from './icons/seed.png'
import balnIcon from './icons/baln.png'
import bnUsdIcon from './icons/bnusd.svg'
import sIcxIcon from './icons/sicx.svg'
import upIcon from './icons/up.png'
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
  UTAP: {
    src: TapIcon,
    height: 25
  },
  SPORTS: {
    src: SportsIcon,
    height: 25
  },
  WOK: {
    src: WokIcon,
    height: 25
  },
  AC3: {
    src: Ac3Icon,
    height: 25
  },
  UETH: {
    src: uethIcon,
    height: 25
  },
  METX: {
    src: metxIcon,
    height: 25
  },
  UP: {
    src: upIcon,
    height: 25
  },
  SEED: {
    src: seedIcon,
    height: 25
  },
  BALN: {
    src: balnIcon,
    height: 25
  },
  BNUSD: {
    src: bnUsdIcon,
    height: 25
  },
  SICX: {
    src: sIcxIcon,
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

export const TokenIcon = ({ token, width, height }) => (
  <Img
    alt='Token image'
    height={height}
    width={width}
    src={getTokenIcon(token).src}
  />
)