import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import classNames from 'classnames/bind'
import React from 'react'

import { styles } from './style'

import CopyBtn from '@src/components/CopyBtn'
import IconTrackerBtn from '@src/components/core/IconTrackerBtn'
import Identicon from '@src/components/core/Identicon'
import Block from '@src/components/core/Block'
import Button from '@src/components/core/Button'
import Col from '@src/components/core/Col'
import Hairline from '@src/components/core/Hairline'
import Paragraph from '@src/components/core/Paragraph'
import Row from '@src/components/core/Row'

export const REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID = 'remove-owner-next-btn'

const CheckOwner = ({ classes, onClose, onSubmit, ownerAddress, ownerName }) => {
  const handleSubmit = (values) => {
    onSubmit(values)
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight="bolder">
          Remove owner
        </Paragraph>
        <Paragraph className={classes.annotation}>1 of 3</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.formContainer}>
        <Row margin="md">
          <Paragraph>Review the owner you want to remove from the active Safe:</Paragraph>
        </Row>
        <Row className={classes.owner}>
          <Col align="center" xs={1}>
            <Identicon address={ownerAddress} diameter={32} />
          </Col>
          <Col xs={7}>
            <Block className={classNames(classes.name, classes.userName)}>
              <Paragraph noMargin size="lg" weight="bolder">
                {ownerName}
              </Paragraph>
              <Block className={classes.user} justify="center">
                <Paragraph className={classes.address} color="disabled" noMargin size="md">
                  {ownerAddress}
                </Paragraph>
                <CopyBtn content={ownerAddress} />
                <IconTrackerBtn type="address" value={ownerAddress} />
              </Block>
            </Block>
          </Col>
        </Row>
      </Block>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <Button minHeight={42} minWidth={140} onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          minHeight={42}
          minWidth={140}
          onClick={handleSubmit}
          testId={REMOVE_OWNER_MODAL_NEXT_BTN_TEST_ID}
          type="submit"
          variant="contained"
        >
          Next
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles as any)(CheckOwner)
