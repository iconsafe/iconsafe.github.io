import React from 'react'
import styled from 'styled-components'

import { Button } from '../../index'

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

export const ModalFooterConfirmation = ({
  cancelText = 'Cancel',
  handleCancel,
  okDisabled,
  handleOk,
  okText = 'Confirm'
}) => {
  return (
    <FooterWrapper>
      <Button size='md' color='secondary' onClick={handleCancel}>
        {cancelText}
      </Button>
      <Button
        color='primary'
        size='md'
        variant='contained'
        onClick={handleOk}
        disabled={okDisabled}
      >
        {okText}
      </Button>
    </FooterWrapper>
  )
}
