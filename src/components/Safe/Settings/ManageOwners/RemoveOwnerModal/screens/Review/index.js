import IconButton from '@material-ui/core/IconButton'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import classNames from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'

import { styles } from './style'

import CopyBtn from '@components/core/CopyBtn'
import IconTrackerBtn from '@components/core/IconTrackerBtn'
import Identicon from '@components/core/Identicon'
import Block from '@components/core/Block'
import Button from '@components/core/Button'
import Col from '@components/core/Col'
import Hairline from '@components/core/Hairline'
import Paragraph from '@components/core/Paragraph'
import Row from '@components/core/Row'

const ReviewRemoveOwner = ({ classes, onClickBack, onClose, onSubmit, ownerAddress, ownerName, values }) => {
  const safeName = useSelector((state) => state.safeName)
  const owners = useSelector((state) => state.walletOwners)

  return (
    <>
      <Row align='center' className={classes.heading} grow>
        <Paragraph className={classes.manage} noMargin weight='bolder'>
          Remove owner
        </Paragraph>
        <Paragraph className={classes.annotation}>2 of 2</Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block>
        <Row className={classes.root}>
          <Col layout='column' xs={4}>
            <Block className={classes.details}>
              <Block margin='lg'>
                <Paragraph color='primary' noMargin size='lg'>
                  Details
                </Paragraph>
              </Block>
              <Block margin='lg'>
                <Paragraph color='disabled' noMargin size='sm'>
                  Safe name
                </Paragraph>
                <Paragraph className={classes.name} color='primary' noMargin size='lg' weight='bolder'>
                  {safeName}
                </Paragraph>
              </Block>
            </Block>
          </Col>
          <Col className={classes.owners} layout='column' xs={8}>
            <Row className={classes.ownersTitle}>
              <Paragraph color='primary' noMargin size='lg'>
                {`${owners.length - 1} Safe owner(s)`}
              </Paragraph>
            </Row>
            <Hairline />
            {owners.map(
              (owner) =>
                owner.address !== ownerAddress && (
                  <React.Fragment key={owner.address}>
                    <Row className={classes.owner}>
                      <Col align='center' xs={1}>
                        <Identicon address={owner.address} diameter={32} />
                      </Col>
                      <Col xs={11}>
                        <Block className={classNames(classes.name, classes.userName)}>
                          <Paragraph noMargin size='lg' weight='bolder'>
                            {owner.name}
                          </Paragraph>
                          <Block className={classes.user} justify='center'>
                            <Paragraph className={classes.address} color='disabled' noMargin size='md'>
                              {owner.address}
                            </Paragraph>
                            <CopyBtn content={owner.address} />
                            <IconTrackerBtn type='address' value={owner.address} />
                          </Block>
                        </Block>
                      </Col>
                    </Row>
                    <Hairline />
                  </React.Fragment>
                )
            )}
            <Row align='center' className={classes.info}>
              <Paragraph color='primary' noMargin size='md' weight='bolder'>
                REMOVING OWNER &darr;
              </Paragraph>
            </Row>
            <Hairline />
            <Row className={classes.selectedOwner}>
              <Col align='center' xs={1}>
                <Identicon address={ownerAddress} diameter={32} />
              </Col>
              <Col xs={11}>
                <Block className={classNames(classes.name, classes.userName)}>
                  <Paragraph noMargin size='lg' weight='bolder'>
                    {ownerName}
                  </Paragraph>
                  <Block className={classes.user} justify='center'>
                    <Paragraph className={classes.address} color='disabled' noMargin size='md'>
                      {ownerAddress}
                    </Paragraph>
                    <CopyBtn content={ownerAddress} />
                    <IconTrackerBtn type='address' value={ownerAddress} />
                  </Block>
                </Block>
              </Col>
            </Row>
            <Hairline />
          </Col>
        </Row>
      </Block>
      <Hairline />
      <Block className={classes.gasCostsContainer}>
        <Paragraph>
          You&apos;re about to create a transaction and will have to confirm it with your currently connected wallet.
        </Paragraph>
      </Block>
      <Hairline />
      <Row align='center' className={classes.buttonRow}>
        <Button minHeight={42} minWidth={140} onClick={onClickBack}>
          Back
        </Button>
        <Button
          color='primary'
          minHeight={42}
          minWidth={140}
          onClick={onSubmit}
          type='submit'
          variant='contained'
        >
          Submit
        </Button>
      </Row>
    </>
  )
}

export default withStyles(styles)(ReviewRemoveOwner)
