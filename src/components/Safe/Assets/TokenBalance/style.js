import { border, lg, md } from '@src/theme/variables'

const cssStyles = {
  expandedTxBlock: {
    borderBottom: `2px solid ${border}`,
    minHeight: '300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  txHash: {
    paddingRight: '3px'
  },
  incomingTxBlock: {
    borderRight: '2px solid rgb(232, 231, 230)'
  },
  emptyRowDataContainer: {
    paddingTop: lg,
    paddingLeft: md,
    paddingBottom: md,
    borderRight: '2px solid rgb(232, 231, 230)'
  },
  loadingBalance: {
  }
}

export const styles = () => cssStyles
