import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import OpenInNew from '@material-ui/icons/OpenInNew'
import classNames from 'classnames'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { styles } from './style'

import Identicon from '@src/components/core/Identicon'
import Modal from '@src/components/Modal'
import Block from '@src/components/core/Block'
import Button from '@src/components/core/Button'
import Col from '@src/components/core/Col'
import Hairline from '@src/components/core/Hairline'
import Link from '@src/components/core/Link'
import Paragraph from '@src/components/core/Paragraph'
import Row from '@src/components/core/Row'
import { history } from '@src/store'
import { md, secondary } from '@src/theme/variables'
import { getIconTrackerLink } from '@src/components/core/IconTrackerBtn'
import { getMultiSigWalletAPI } from '@src/utils/msw'

const openIconStyle = {
  height: md,
  color: secondary
}

const RemoveSafeComponent = ({ classes, isOpen, onClose }) => {
  const safeAddress = useSelector((state) => state.safeAddress)
  const safeName = useSelector((state) => state.safeName)
  const dispatch = useDispatch()
  const msw = getMultiSigWalletAPI(safeAddress)
  const trackerLink = getIconTrackerLink(msw, safeAddress)

  return (
    <Modal
      description='Remove the selected Safe'
      handleClose={onClose}
      open={isOpen}
      paperClassName={classes.modal}
      title='Remove Safe'
    >
      <Row align='center' className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight='bolder'>
          Remove Safe
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.container}>
        <Row className={classes.owner}>
          <Col align='center' xs={1}>
            <Identicon address={safeAddress} diameter={32} />
          </Col>
          <Col xs={11}>
            <Block className={classNames(classes.name, classes.userName)}>
              <Paragraph noMargin size='lg' weight='bolder'>
                {safeName}
              </Paragraph>
              <Block className={classes.user} justify='center'>
                <Paragraph color='disabled' noMargin size='md'>
                  {safeAddress}
                </Paragraph>
                <Link className={classes.open} target='_blank' to={trackerLink}>
                  <OpenInNew style={openIconStyle} />
                </Link>
              </Block>
            </Block>
          </Col>
        </Row>
        <Hairline />
        <Row className={classes.description}>
          <Paragraph noMargin>
            Removing a Safe only removes it from your interface. <b>It does not delete the Safe</b>. You can always add
            it back using the Safe&apos;s address.
          </Paragraph>
        </Row>
      </Block>
      <Hairline />
      <Row align='center' className={classes.buttonRow}>
        <Button minHeight={42} minWidth={140} onClick={onClose}>
          Cancel
        </Button>
        <Button
          className={classes.buttonRemove}
          minWidth={140}
          onClick={() => {
            onClose()
          }}
          type='submit'
          variant='contained'
        >
          Remove
        </Button>
      </Row>
    </Modal>
  )
}

export const RemoveSafeModal = withStyles(styles)(RemoveSafeComponent)
