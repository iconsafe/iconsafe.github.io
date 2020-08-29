import { createStyles } from '@material-ui/core/styles'
import { lg, md } from '@src/theme/variables'

export const styles = createStyles({
  txDataContainer: {
    paddingTop: lg,
    paddingLeft: md,
    paddingRight: md,
    paddingBottom: md
  },
  txData: {
    wordBreak: 'break-all'
  },
  txDataParagraph: {
    whiteSpace: 'normal'
  },
  linkTxData: {
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  multiSendTxData: {
    marginTop: `-${lg}`,
    marginLeft: `-${md}`
  },
  collapse: {
    borderBottom: '2px solid rgb(232, 231, 230)'
  },
  collapseHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 8px 8px 16px',
    borderBottom: '2px solid rgb(232, 231, 230)',

    '&:hover': {
      cursor: 'pointer'
    }
  },
  address: {
    display: 'inline-flex'
  },
  transactionDescriptionContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  transferDestination: {
    paddingLeft: '10px'
  },
  nested: {
    paddingLeft: '20px'
  },
  failReasonBlock: {
    display: 'flex',
    flexDirection: 'row'
  },
  failReasonBox: {
    paddingLeft: '5px'
  }
})
