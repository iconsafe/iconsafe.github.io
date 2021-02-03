import { border, lg, md } from '@src/theme/variables'

const cssStyles = {
  expandedTxBlock: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  txDataContainer: {
    padding: `${lg} ${md}`
  },
  txHash: {
    paddingRight: '3px'
  },
  incomingTxBlock: {
  },
  emptyRowDataContainer: {
    paddingTop: lg,
    paddingLeft: md,
    paddingBottom: md
  },
  colLeft: {
    width: '60%'
  },
  colRight: {
    borderLeft: `2px solid ${border}`,
    boxSizing: 'border-box',
    width: '40%'
  }
}

export const styles = () => cssStyles
