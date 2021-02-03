import { createStyles } from '@material-ui/core'

import {
  background,
  bolderFont,
  border,
  fontColor,
  largeFontSize,
  md,
  screenSm,
  secondary,
  sm,
  xs
} from '@src/theme/variables'

export const styles = () => ({
  buttonSubmit: {
    marginLeft: '20px'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '300px',

    [`@media (min-width: ${screenSm}px)`]: {
      display: 'flex',
      flexDirection: 'row',
      height: '100%'
    }
  },
  builder: {
    borderRight: `solid 2px ${border}`,
    height: '100%',
    width: '100%'
  },
  overview: {
    width: '100%'
  }
})
