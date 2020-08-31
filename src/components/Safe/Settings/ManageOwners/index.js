import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import RemoveOwnerIcon from '../assets/icons/bin.svg'

import OwnerAddressTableCell from './OwnerAddressTableCell'
// import AddOwnerModal from './AddOwnerModal'
// import EditOwnerModal from './EditOwnerModal'
// import RemoveOwnerModal from './RemoveOwnerModal'
// import ReplaceOwnerModal from './ReplaceOwnerModal'

import RenameOwnerIcon from './assets/icons/rename-owner.svg'
import ReplaceOwnerIcon from './assets/icons/replace-owner.svg'
import { OWNERS_TABLE_ADDRESS_ID, OWNERS_TABLE_NAME_ID, generateColumns, getOwnerData } from './dataFetcher'
import { styles } from './style'

import Table from '@components/Table'
import { cellWidth } from '@components/Table/TableHead'
import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Col from '@components/core/Col'
import Hairline from '@components/core/Hairline'
import Heading from '@components/core/Heading'
import Img from '@components/core/Img'
import Paragraph from '@components/core/Paragraph/index'
import Row from '@components/core/Row'

const ManageOwners = ({ classes, granted }) => {
  // const [selectedOwnerAddress, setSelectedOwnerAddress] = useState(undefined)
  // const [selectedOwnerName, setSelectedOwnerName] = useState(undefined)
  // const [showAddOwner, setShowAddOwner] = useState(false)
  // const [showRemoveOwner, setShowRemoveOwner] = useState(false)
  // const [showReplaceOwner, setShowReplaceOwner] = useState(false)
  // const [showEditOwner, setShowEditOwner] = useState(false)

  const onShow = (action, row) => {
    // setState({
    //   [`show${action}`]: true,
    //   selectedOwnerAddress: row && row.address,
    //   selectedOwnerName: row && row.name
    // })
  }

  const onHide = (action) => {
    // setState({
    //   [`show${action}`]: false,
    //   selectedOwnerAddress: undefined,
    //   selectedOwnerName: undefined
    // })
  }

  const columns = generateColumns()
  const autoColumns = columns.filter((c) => !c.custom)
  const owners = useSelector((state) => state.walletOwners)
  const ownerData = getOwnerData(owners)

  return (
    <>
      <Block className={classes.formContainer}>
        <Heading className={classes.title} tag='h2'>
          Manage Safe Owners
        </Heading>
        <Paragraph className={classes.annotation}>
          Add, remove and replace owners or rename existing owners.
        </Paragraph>
        <TableContainer>
          <Table
            columns={columns}
            data={ownerData}
            defaultFixed
            defaultOrderBy={OWNERS_TABLE_NAME_ID}
            disablePagination
            label='Owners'
            noBorder
            size={ownerData.size}
          >
            {(sortedData) =>
              sortedData.map((row, index) => (
                <TableRow
                  className={cn(classes.hide, index >= 3 && index === sortedData.size - 1 && classes.noBorderBottom)}
                  key={index}
                  tabIndex={-1}
                >
                  {autoColumns.map((column) => (
                    <TableCell align={column.align} component='td' key={column.id} style={cellWidth(column.width)}>
                      {column.id === OWNERS_TABLE_ADDRESS_ID ? (
                        <OwnerAddressTableCell address={row[column.id]} showLinks />
                      )
                        : (
                          row[column.id]
                        )}
                    </TableCell>
                  ))}
                  <TableCell component='td'>
                    <Row align='end' className={classes.actions}>
                      <Img
                        alt='Edit owner'
                        className={classes.editOwnerIcon}
                        onClick={onShow('EditOwner', row)}
                        src={RenameOwnerIcon}
                      />
                      {granted && (
                        <>
                          <Img
                            alt='Replace owner'
                            className={classes.replaceOwnerIcon}
                            onClick={onShow('ReplaceOwner', row)}
                            src={ReplaceOwnerIcon}
                          />
                          {ownerData.size > 1 && (
                            <Img
                              alt='Remove owner'
                              className={classes.removeOwnerIcon}
                              onClick={onShow('RemoveOwner', row)}
                              src={RemoveOwnerIcon}
                            />
                          )}
                        </>
                      )}
                    </Row>
                  </TableCell>
                </TableRow>
              ))}
          </Table>
        </TableContainer>
      </Block>
      {granted && (
        <>
          <Hairline />
          <Row align='end' className={classes.controlsRow} grow>
            <Col end='xs'>
              <Button
                color='primary'
                onClick={onShow('AddOwner')}
                size='small'
                variant='contained'
              >
                Add new owner
              </Button>
            </Col>
          </Row>
        </>
      )}
      {/* <AddOwnerModal isOpen={showAddOwner} onClose={onHide('AddOwner')} />
        <RemoveOwnerModal
          isOpen={showRemoveOwner}
          onClose={onHide('RemoveOwner')}
          ownerAddress={selectedOwnerAddress}
          ownerName={selectedOwnerName}
        />
        <ReplaceOwnerModal
          isOpen={showReplaceOwner}
          onClose={onHide('ReplaceOwner')}
          ownerAddress={selectedOwnerAddress}
          ownerName={selectedOwnerName}
        />
        <EditOwnerModal
          isOpen={showEditOwner}
          onClose={onHide('EditOwner')}
          ownerAddress={selectedOwnerAddress}
          selectedOwnerName={selectedOwnerName}
        /> */}
    </>
  )
}

export default withStyles(styles)(ManageOwners)
