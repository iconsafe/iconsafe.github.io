import React, { useEffect, useState } from 'react'
import { ICONTrackerLink } from '@components/ICON'
import Identicon from '@components/core/Identicon'
import Block from '@components/core/Block'
import Paragraph from '@components/core/Paragraph'
import { useWindowDimensions } from '@src/utils/display'

const OwnerAddressTableCell = (props) => {
  const { address, knownAddress, showLinks, userName } = props
  const [cut, setCut] = useState(undefined)
  const { width } = useWindowDimensions()

  useEffect(() => {
    if (width <= 900) {
      setCut(6)
    } else if (width <= 1024) {
      setCut(12)
    } else {
      setCut(undefined)
    }
  }, [width])

  return (
    <Block justify='left'>
      <Identicon address={address} diameter={32} />
      {showLinks ? (
        <div style={{ marginLeft: 10, flexShrink: 1, minWidth: 0 }}>
          {!userName || userName === 'UNKNOWN' ? null : userName}
          <ICONTrackerLink knownAddress={knownAddress} value={address} cut={cut} />
        </div>
      )
        : (
          <Paragraph style={{ marginLeft: 10 }}>{address}</Paragraph>
        )}
    </Block>
  )
}

export default OwnerAddressTableCell
