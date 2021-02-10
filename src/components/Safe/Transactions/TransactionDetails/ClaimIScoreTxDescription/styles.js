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
  },
  cyanText: {
    color: '#32b8bb'
  },
  collapseHeaderWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 8px 8px 16px',

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
  }
})
