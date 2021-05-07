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
  section: {
    marginBottom: '40px'
  },
  buttonSubmit: {
    marginTop: '20px'
  },
  sectionSep: {
    marginBottom: '15px !important'
  },
  // Staking
  addressInput: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: '#efefef',
    width: '300px'
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
  },
  slider: {
    width: '100%',
    marginTop: '20px'
  },
  input: {
    height: '40px',
    width: '110px'
  },
  stakeChoser: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  stakeAmount: {
    marginBottom: '40px'
  },

  // Delegation
  delegateInput: {
    height: '30px'
  },
  delegateTable: {
    borderCollapse: 'collapse'
  },
  overview: {
    width: '100%'
  },
  select: {
    width: '100%'
  },
  prepname: {
    width: '70%'
  },
  prepvotes: {
    width: '20%'
  },
  cancelx: {
    width: '10%'
  },
  votes: {
    marginTop: '20px'
  },
  alertvotes: {
    marginTop: '20px',
    marginBottom: '20px'
  }
})
