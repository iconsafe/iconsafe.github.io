import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import { withStyles, makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import classNames from 'classnames/bind'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddIcon from '@material-ui/icons/Add'
import RemoveOwnerIcon from '../assets/icons/bin.svg'

import OwnerAddressTableCell from './OwnerAddressTableCell'
import AddOwnerModal from './AddOwnerModal'
import RemoveOwnerModal from './RemoveOwnerModal'
// import EditOwnerModal from './EditOwnerModal'
// import ReplaceOwnerModal from './ReplaceOwnerModal'

import RenameOwnerIcon from './assets/icons/rename-owner.svg'
import ReplaceOwnerIcon from './assets/icons/replace-owner.svg'
import { OWNERS_TABLE_ADDRESS_ID, OWNERS_TABLE_NAME_ID, OWNERS_TABLE_ACTIONS_ID, generateColumns, getOwnerData } from './dataFetcher'
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

const useStyles = makeStyles(styles)

const ManageOwners = ({ granted }) => {
  const classes = useStyles()
  const [selectedOwnerAddress, setSelectedOwnerAddress] = useState(undefined)
  const [selectedOwnerName, setSelectedOwnerName] = useState(undefined)
  const [showAddOwner, setShowAddOwner] = useState(false)
  const [showRemoveOwner, setShowRemoveOwner] = useState(false)
  const [showReplaceOwner, setShowReplaceOwner] = useState(false)
  const [showEditOwner, setShowEditOwner] = useState(false)

  const onShow = (action, row) => {
    console.log('onShow ', action, row)
    setSelectedOwnerAddress(row && row.address)
    setSelectedOwnerName(row && row.name)

    switch (action) {
      case 'AddOwner': setShowAddOwner(true); break
      case 'RemoveOwner': setShowRemoveOwner(true); break
      case 'ReplaceOwner': setShowReplaceOwner(true); break
      case 'EditOwner': setShowEditOwner(true); break
    }
  }

  const onHide = (action) => {
    console.log('onHide ', action)
    setSelectedOwnerAddress(undefined)
    setSelectedOwnerName(undefined)

    switch (action) {
      case 'AddOwner': setShowAddOwner(false); break
      case 'RemoveOwner': setShowRemoveOwner(false); break
      case 'ReplaceOwner': setShowReplaceOwner(false); break
      case 'EditOwner': setShowEditOwner(false); break
    }
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
            size={ownerData.length}
          >
            {(sortedData) =>
              sortedData.map((row, index) => (
                <TableRow
                  className={cn(classes.hide, index >= 3 && index === sortedData.length - 1 && classes.noBorderBottom)}
                  key={index}
                  tabIndex={-1}
                >
                  {autoColumns.map((column) => (
                    <TableCell align={column.align} component='td' key={column.id}>
                      {column.id === OWNERS_TABLE_ADDRESS_ID ? (
                        <OwnerAddressTableCell address={row[column.id]} showLinks />
                      )
                        : column.id === OWNERS_TABLE_ACTIONS_ID ? (
                          <Row align='end' className={classes.actions}>
                            <Img
                              alt='Edit owner'
                              className={classes.editOwnerIcon}
                              onClick={() => onShow('EditOwner', row)}
                              src={RenameOwnerIcon}
                            />
                            {granted && (
                              <>
                                <Img
                                  alt='Replace owner'
                                  className={classes.replaceOwnerIcon}
                                  onClick={() => onShow('ReplaceOwner', row)}
                                  src={ReplaceOwnerIcon}
                                />
                                {console.log('ownerData=', ownerData) || ownerData.length > 1 && (
                                  <Img
                                    alt='Remove owner'
                                    className={classes.removeOwnerIcon}
                                    onClick={() => onShow('RemoveOwner', row)}
                                    src={RemoveOwnerIcon}
                                  />
                                )}
                              </>
                            )}
                          </Row>
                        )
                          : (
                            row[column.id]
                          )}
                    </TableCell>
                  ))}
                  {/* <TableCell component='td'>
                    <Row align='end' className={classes.actions}>
                      <Img
                        alt='Edit owner'
                        className={classes.editOwnerIcon}
                        onClick={() => onShow('EditOwner', row)}
                        src={RenameOwnerIcon}
                      />
                      {granted && (
                        <>
                          <Img
                            alt='Replace owner'
                            className={classes.replaceOwnerIcon}
                            onClick={() => onShow('ReplaceOwner', row)}
                            src={ReplaceOwnerIcon}
                          />
                          {ownerData.length > 1 && (
                            <Img
                              alt='Remove owner'
                              className={classes.removeOwnerIcon}
                              onClick={() => onShow('RemoveOwner', row)}
                              src={RemoveOwnerIcon}
                            />
                          )}
                        </>
                      )}
                    </Row>
                  </TableCell> */}
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
                onClick={() => onShow('AddOwner')}
                size='small'
                variant='contained'
              >
                <AddIcon
                  alt='Add token'
                  className={classNames(classes.leftIcon, classes.iconSmall)}
                  component={undefined}
                />
                Add owner
              </Button>
            </Col>
          </Row>
        </>
      )}
      <AddOwnerModal isOpen={showAddOwner} onClose={() => onHide('AddOwner')} />
      <RemoveOwnerModal
        isOpen={showRemoveOwner}
        onClose={() => onHide('RemoveOwner')}
        ownerAddress={selectedOwnerAddress}
        ownerName={selectedOwnerName}
      />
      {/* <ReplaceOwnerModal
          isOpen={showReplaceOwner}
          onClose={() => onHide('ReplaceOwner')}
          ownerAddress={selectedOwnerAddress}
          ownerName={selectedOwnerName}
        />
        <EditOwnerModal
          isOpen={showEditOwner}
          onClose={() => onHide('EditOwner')}
          ownerAddress={selectedOwnerAddress}
          selectedOwnerName={selectedOwnerName}
        /> */}
    </>
  )
}

export default withStyles(styles)(ManageOwners)
