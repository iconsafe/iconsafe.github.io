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
  addressInput: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: '#efefef',
    width: '300px'
  },
  buttonSubmitContract: {
    marginLeft: '20px',
    minHeight: '100% !important'
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
  icxTransfer: {
    width: '100%'
  }
})
