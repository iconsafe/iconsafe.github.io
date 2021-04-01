import { Button } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import OpenInNew from '@material-ui/icons/OpenInNew'
import cn from 'classnames'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { styles } from './style'

import { ModulePair } from 'src/logic/safe/store/models/safe'
import { (state) => state.safeAddress } from 'src/logic/safe/store/selectors'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import createTransaction from 'src/logic/safe/store/actions/createTransaction'
import { TX_NOTIFICATION_TYPES } from 'src/logic/safe/transactions'
import Modal from '@components/Modal'
import Row from '@components/core/Row'
import Paragraph from '@components/core/Paragraph'
import Hairline from '@components/core/Hairline'
import Block from '@components/core/Block'
import Col from '@components/core/Col'
import Identicon from '@components/core/Identicon'
import Link from '@components/core/Link'
import { getEtherScanLink } from 'src/logic/wallets/getWeb3'
import { md, secondary } from '@src/theme/variables'

const useStyles = makeStyles(styles)

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

const openIconStyle = {
  height: md,
  color: secondary,
}

interface RemoveModuleModal {
  onClose: () => void
  selectedModule: ModulePair
}

const RemoveModuleModal = ({ onClose, selectedModule }: RemoveModuleModal): React.ReactElement => {
  const classes = useStyles()

  const safeAddress = useSelector((state) => state.safeAddress)

  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const dispatch = useDispatch()

  const removeSelectedModule = async (): Promise<void> => {
    try {
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress)
      const [module, prevModule] = selectedModule
      const txData = safeInstance.methods.disableModule(prevModule, module).encodeABI()

      dispatch(
        createTransaction({
          safeAddress,
          to: safeAddress,
          valueInWei: '0',
          txData,
          notifiedTransaction: TX_NOTIFICATION_TYPES.SETTINGS_CHANGE_TX,
          enqueueSnackbar,
          closeSnackbar,
        }),
      )
    } catch (e) {
      console.error(`failed to remove the module ${selectedModule}`, e.message)
    }
  }

  return (
    <>
      <Modal
        description="Remove the selected Module"
        handleClose={onClose}
        paperClassName={classes.modal}
        title="Remove Module"
        open
      >
        <Row align="center" className={classes.modalHeading} grow>
          <Paragraph className={classes.modalManage} noMargin weight="bolder">
            Remove Module
          </Paragraph>
          <IconButton disableRipple onClick={onClose}>
            <Close className={classes.modalClose} />
          </IconButton>
        </Row>
        <Hairline />
        <Block className={classes.modalContainer}>
          <Row className={classes.modalOwner}>
            <Col align="center" xs={1}>
              <Identicon className='inverted' address={selectedModule[0]} diameter={32} />
            </Col>
            <Col xs={11}>
              <Block className={cn(classes.modalName, classes.modalUserName)}>
                <Paragraph noMargin size="lg" weight="bolder">
                  {selectedModule[0]}
                </Paragraph>
                <Block className={classes.modalUser} justify="center">
                  <Paragraph color="disabled" noMargin size="md">
                    {selectedModule[0]}
                  </Paragraph>
                  <Link
                    className={classes.modalOpen}
                    target="_blank"
                    to={getEtherScanLink('address', selectedModule[0])}
                  >
                    <OpenInNew style={openIconStyle} />
                  </Link>
                </Block>
              </Block>
            </Col>
          </Row>
          <Hairline />
          <Row className={classes.modalDescription}>
            <Paragraph noMargin>
              After removing this module, any feature or app that uses this module might no longer work. If this Safe
              requires more then one signature, the module removal will have to be confirmed by other owners as well.
            </Paragraph>
          </Row>
        </Block>
        <Hairline />
        <Row align="center" className={classes.modalButtonRow}>
          <FooterWrapper>
            <Button size="md" color="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button color="error" size="md" variant="contained" onClick={removeSelectedModule}>
              Remove
            </Button>
          </FooterWrapper>
        </Row>
      </Modal>
    </>
  )
}

export default RemoveModuleModal
