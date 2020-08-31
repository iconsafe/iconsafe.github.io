import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import QRIcon from '@src/assets/icons/qrcode.svg'
import ScanQRModal from '@components/ScanQRModal'
import Img from '@components/core/Img'

const useStyles = makeStyles({
  qrCodeBtn: {
    cursor: 'pointer'
  }
})

export const ScanQRWrapper = (props) => {
  const classes = useStyles()
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const openQrModal = () => {
    setQrModalOpen(true)
  }

  const closeQrModal = () => {
    setQrModalOpen(false)
  }

  const onScanFinished = (value) => {
    setQrModalOpen(false)
    props.handleScan(value, () => closeQrModal())
  }

  return (
    <>
      <Img
        alt='Scan QR'
        className={classes.qrCodeBtn}
        height={20}
        onClick={() => openQrModal()}
        role='button'
        src={QRIcon}
        testId='qr-icon'
      />
      {qrModalOpen && <ScanQRModal isOpen={qrModalOpen} onClose={() => closeQrModal()} onScan={(value) => onScanFinished(value)} />}
    </>
  )
}
