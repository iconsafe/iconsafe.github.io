import React from 'react'
import styled from 'styled-components'
import IconTrackerBtn from '@components/core/IconTrackerBtn'
import CopyBtn from '@components/core/CopyBtn'

import {
  Text,
  Identicon,
  EllipsisMenu
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
  showTrackerBtn,
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
          {showCopyBtn && <CopyBtn content={hash} />}
          {showTrackerBtn && <IconTrackerBtn value={hash} />}
          {menuItems && <EllipsisMenu menuItems={menuItems} />}
        </AddressContainer>
      </InfoContainer>
    </StyledContainer>
  )

export default ICONHashInfo
