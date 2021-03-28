import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Paper from '@material-ui/core/Paper'
import { screenSm, sm } from '@src/theme/variables'
import CallReceived from '@material-ui/icons/CallReceived'
import CallMade from '@material-ui/icons/CallMade'
import classNames from 'classnames/bind'
import { lowercaseWithCapital } from '@src/utils/strings'
import Img from '@components/core/Img'
import { getTokenIcon } from '@components/TokenIcon'
import Row from '@components/core/Row'
import Status from '@components/Safe/Transactions/Status'
import IconButton from '@material-ui/core/IconButton'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { displayUnit, convertTsToDateString } from '@src/utils/icon'
import TransactionDetails from '@components/Safe/Transactions/TransactionDetails'
import Collapse from '@material-ui/core/Collapse'
import cn from 'classnames'
import { useRouteMatch, useHistory } from 'react-router-dom'

function descendingComparator (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator (order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort (array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  { id: 'uid', disablePadding: false, label: 'ID' },
  { id: 'type', disablePadding: false, label: 'Type' },
  { id: 'amount', disablePadding: false, label: 'Amount' },
  { id: 'date', disablePadding: false, label: 'Date' },
  { id: 'status', disablePadding: false, label: 'Status' }
]

function EnhancedTableHead ({ classes, order, orderBy, rowCount, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={headCells.length === index + 1 ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              <b>{headCell.label}</b>
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell />
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  additionalChild: {
    flexWrap: 'nowrap',
    marginBottom: sm,
    [`@media (min-width: ${screenSm}px)`]: {
      marginBottom: '0'
    }
  },
  pagination: {
    display: 'flex',
    overflow: 'hidden',
    width: '100%',
    [`@media (min-width: ${screenSm}px)`]: {
      marginLeft: 'auto',
      width: 'auto'
    }
  },
  root: {
    width: '100%'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  singleTxContainer: {
    borderRadius: '8px',
    marginBottom: '10px'
  },
  singleTxPaper: {
    marginBottom: '50px'
  },
  table: {
    minWidth: 350
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  iconSmall: {
    fontSize: 16
  },
  leftIcon: {
    marginRight: sm
  },
  greenIcon: {
    color: 'green'
  },
  redIcon: {
    color: 'red'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  // Success
  tableRow: {
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#e1faf2'
    }
  },
  expandedRow: {
    backgroundColor: '#e1faf2 !important'
  },
  // Failed
  tableRowFailed: {
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#ffe8e8',
    }
  },
  expandedRowFailed: {
    backgroundColor: '#ffe8e8 !important'
  },
  // Waiting
  tableRowWaiting: {
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#fff3e2',
    }
  },
  expandedRowWaiting: {
    backgroundColor: '#fff3e2 !important'
  },

  extendedTxContainerSuccess: {
    padding: 0,
    border: 0,
    '&:last-child': {
      padding: 0
    },
    backgroundColor: '#fafcfc'
  },
  extendedTxContainerWaiting: {
    padding: 0,
    border: 0,
    '&:last-child': {
      padding: 0
    },
    backgroundColor: '#fff8ea'
  },
  extendedTxContainerError: {
    padding: 0,
    border: 0,
    '&:last-child': {
      padding: 0
    },
    backgroundColor: '#ffeeee'
  },
  tokenIconRow: {
    padding: '5px'
  }
}))

export default function EnhancedTable ({ rows, queriedTx }) {
  const classes = useStyles()
  const match = useRouteMatch()
  const history = useHistory()

  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('uid')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [expandedTx, setExpandedTx] = useState(null)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleClick = (row) => {
    setExpandedTx((prev) => (prev === row.uid ? null : row.uid))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value))
    setPage(0)
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)
  const closeImgStyle = { cursor: 'pointer', float: 'right', marginTop: '15px', marginRight: '15px', width: '15px' }
  const closeImg = require('./assets/close.png')

  const closeTransaction = () => {
    history.push(`${match.url}/transactions`)
  }

  return (
    <div className={classes.root}>

      {queriedTx &&
        // Selected transaction by URL
        <Paper className={cn(classes.paper, classes.singleTxPaper)}>
          <TableContainer className={classes.singleTxContainer}>
            <Table
              className={classes.table}
              aria-labelledby='tableTitle'
              size='medium'
              aria-label='enhanced table'
            >
              <TableBody>
                <TableRow>
                  <TableCell
                    className={
                      queriedTx.status === 'FAILED' ? classes.extendedTxContainerError :
                        queriedTx.status === 'WAITING' ? classes.extendedTxContainerWaiting :
                          classes.extendedTxContainerSuccess}
                    colSpan={6}
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                  >
                    <Img style={closeImgStyle} src={closeImg} onClick={() => closeTransaction()} />
                    <TransactionDetails transaction={queriedTx} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>}

      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            size='medium'
            aria-label='enhanced table'
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>

              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const hasFailed = row.status === 'FAILED'
                  const isWaiting = row.status === 'WAITING'
                  const isSelected = expandedTx === row.uid

                  return (
                    <React.Fragment key={row.uid}>
                      <TableRow
                        hover
                        className={cn(
                          hasFailed ? classes.tableRowFailed :
                            isWaiting ? classes.tableRowWaiting : classes.tableRow,
                          isSelected && (
                            hasFailed ? classes.expandedRowFailed :
                              isWaiting ? classes.expandedRowWaiting : classes.expandedRow))}
                        onClick={() => handleClick(row)}
                        tabIndex={-1}
                        key={row.uid}
                      >
                        <TableCell align='left' component='th' scope='row'>
                          {row.uid}
                        </TableCell>
                        <TableCell align='left'>

                          {row.type === 'INCOMING' && <>
                            <CallReceived
                              alt='Incoming transaction'
                              className={classNames(classes.greenIcon, classes.leftIcon, classes.iconSmall)}
                            />
                            <span>Incoming transfer</span>
                          </>}

                          {row.type === 'CLAIM_ISCORE' && <>
                            <CallReceived
                              alt='Incoming transaction'
                              className={classNames(classes.greenIcon, classes.leftIcon, classes.iconSmall)}
                            />
                            <span>I-Score claimed</span>
                          </>}

                          {row.type === 'OUTGOING' && <>
                            <CallMade
                              alt='Outgoing transaction'
                              className={classNames(classes.redIcon, classes.leftIcon, classes.iconSmall)}
                            />
                            <span>Outgoing transaction</span>
                          </>}

                        </TableCell>
                        <TableCell align='left'>

                          {/* Default display : 0 ICX */}
                          {row.tokens.length === 0 &&
                            <Row>-</Row>}

                          {/* Display Sum of tokens */}
                          {row.tokens.map((token, index) => (
                            <Row className={classes.tokenIconRow} key={`${row.uid}-token-${index}`}>
                              <Img
                                style={{ paddingRight: '8px', verticalAlign: 'bottom' }}
                                height={20}
                                src={getTokenIcon(token.symbol).src} alt={token.symbol}
                              />
                              {parseFloat(displayUnit(token.transfers
                                .map(transfer => transfer.amount)
                                .reduce((acc, cur) => acc.plus(cur)), token.decimals)).toLocaleString()} {token.symbol}
                            </Row>
                          ))}
                        </TableCell>
                        <TableCell align='left'>{convertTsToDateString(row.created_timestamp)}</TableCell>

                        <TableCell align='right'>
                          <Row align='end' className={classes.actions}>
                            <Status status={row.status} />
                          </Row>
                        </TableCell>

                        <TableCell align='right' className={classes.expandCellStyle}>
                          <IconButton disableRipple>
                            {expandedTx === row.uid ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      {/* Extension */}
                      <TableCell
                        className={
                          hasFailed ? classes.extendedTxContainerError :
                            isWaiting ? classes.extendedTxContainerWaiting :
                              classes.extendedTxContainerSuccess}
                        colSpan={6}
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        <Collapse
                          in={expandedTx === row.uid}
                          timeout='auto'
                          unmountOnExit
                        >
                          <TransactionDetails transaction={row} />
                        </Collapse>
                      </TableCell>
                    </React.Fragment>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: expandedTx ? 0 : (20 * emptyRows) }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}
