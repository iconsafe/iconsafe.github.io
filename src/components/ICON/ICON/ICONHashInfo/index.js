import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import {
  Text,
  Identicon,
  EllipsisMenu,
  ICONTrackerButton,
  CopyToClipboardBtn
} from '../..'
import { textShortener } from '../../utils/strings'

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
`

const IdenticonContainer = styled.div`
  display: flex;
  margin-right: 8px;
`

const InfoContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
`

const AddressContainer = styled.div`
  display: flex;
  align-items: center;

  *:not(:first-child) {
    margin-left: 8px;
  }
`

const ICONHashInfo = ({
  hash,
  name,
  textColor = 'text',
  textSize = 'lg',
  identiconSize = 'md',
  className,
  shortenHash,
  showIdenticon,
  showCopyBtn,
  menuItems,
  showEtherscanBtn,
  network
}) =>
  (
    <StyledContainer className={className}>
      {showIdenticon && (
        <IdenticonContainer>
          <Identicon address={hash} size={identiconSize} />
        </IdenticonContainer>
      )}

      <InfoContainer>
        {name && (
          <Text size={textSize} color={textColor}>
            {name}
          </Text>
        )}
        <AddressContainer>
          <Text size={textSize} color={textColor}>
            {shortenHash
              ? textShortener(hash, shortenHash + 2, shortenHash)
              : hash}
          </Text>
          {showCopyBtn && <CopyToClipboardBtn textToCopy={hash} />}
          {showEtherscanBtn && <ICONTrackerButton value={hash} network={network} />}
          {menuItems && <EllipsisMenu menuItems={menuItems} />}
        </AddressContainer>
      </InfoContainer>
    </StyledContainer>
  )

const mapStateToProps = state => {
  return {
    networkConnected: state.networkConnected
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ICONHashInfo)
