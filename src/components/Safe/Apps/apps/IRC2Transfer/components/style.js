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
  select: {
    width: '100%'
  }
})
