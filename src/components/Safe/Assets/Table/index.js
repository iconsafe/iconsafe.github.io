import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import TableContainer from '@material-ui/core/TableContainer'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import Collapse from '@material-ui/core/Collapse'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Paper from '@material-ui/core/Paper'
import { getTokenIcon } from '@components/TokenIcon'
import Img from '@components/core/Img'
import Block from '@components/core/Block'
import Row from '@components/core/Row'
import { screenSm, sm } from '@src/theme/variables'
import { displayUnit, ICX_TOKEN_ADDRESS } from '@src/utils/icon'
import cn from 'classnames'
import TokenBalance from '@components/Safe/Assets/TokenBalance'
import { IconConverter } from 'icon-sdk-js'
import { nFormatter } from '@src/utils/misc'

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
  { id: 'asset', disablePadding: false, label: 'Asset' },
  { id: 'balance', disablePadding: false, label: 'Balance' },
  { id: 'value', disablePadding: false, label: 'Value' }
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
        <TableCell align='right' />
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
  tableRow: {
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: '#e7efef'
    }
  },
  expandedRow: {
    backgroundColor: '#e7efef'
  },
  extendedTxContainer: {
    padding: 0,
    border: 0,
    '&:last-child': {
      padding: 0
    },
    backgroundColor: '#fffaf4'
  }
}))

export default function EnhancedTable ({ rows, additionalChild }) {
  const classes = useStyles()
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('asset')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [expandedTx, setExpandedTx] = useState(null)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleClick = (row) => {
    setExpandedTx((prevToken) => (prevToken === row.token ? null : row.token))
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value))
    setPage(0)
  }

  const displayIcxBalance = (row) => {
    if (!row.iiss) {
      return
    }

    if (row.iiss.staked.isZero() && row.iiss.unstaking.isZero()) {
      return
    }

    let result = ` (${nFormatter(displayUnit(row.iiss.available, row.decimals), 2)} unstaked`

    if (!row.iiss.staked.isZero()) {
      result += ` + ${nFormatter(displayUnit(row.iiss.staked, row.decimals), 2)} staked`
    }

    if (!row.iiss.unstaking.isZero()) {
      result += ` + ${nFormatter(displayUnit(row.iiss.unstaking, row.decimals), 2)} unstacking`
    }

    result += ')'

    return result
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

  return (
    <div className={classes.root}>
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
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <React.Fragment key={row.token}>
                      <TableRow
                        hover
                        className={cn(classes.tableRow, expandedTx === row.token && classes.expandedRow)}
                        onClick={() => handleClick(row)}
                        tabIndex={-1}
                      >
                        <TableCell component='th' id={labelId} scope='row'>
                          <Img style={{ paddingRight: '8px', verticalAlign: 'bottom' }} height={20} src={getTokenIcon(row.symbol).src} alt={row.symbol} />
                          {row.symbol}
                        </TableCell>
                        <TableCell align='left'>
                          {displayUnit(row.balance.plus(row.unstaking ? row.iiss.unstaking : 0), row.decimals)}
                          {row.token === ICX_TOKEN_ADDRESS && displayIcxBalance(row)}
                        </TableCell>
                        <TableCell align='right'>{row.value === '?' ? row.value : parseFloat(displayUnit(row.value, row.decimals)).toFixed(2)} USD</TableCell>
                        <TableCell align='right' className={classes.expandCellStyle}>
                          <IconButton disableRipple>
                            {expandedTx === row.token ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </TableCell>
                      </TableRow>

                      {/* Extension */}
                      <TableRow>
                        <TableCell
                          className={classes.extendedTxContainer}
                          colSpan={6}
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                        >
                          <Collapse
                            in={expandedTx === row.token}
                            timeout='auto'
                            unmountOnExit
                          >
                            <TokenBalance token={row} />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 40 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Block className={classes.container}>
          <Row className={classes.additionalChild}>{additionalChild}</Row>
          <Row className={classes.pagination}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Row>
        </Block>
      </Paper>
    </div >
  )
}
