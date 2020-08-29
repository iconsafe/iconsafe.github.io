import React from 'react'

import OwnerComponent from './OwnerComponent'

const OwnersList = (props) => {
  const { ownersUnconfirmed, ownersWhoConfirmed } = props

  return (
    <>
      {ownersWhoConfirmed.map((owner) => (
        <OwnerComponent confirmed key={owner} owner={owner} {...props} />
      ))}
      {ownersUnconfirmed.map(({ hasPendingAcceptActions, hasPendingRejectActions, owner }) => (
        <OwnerComponent
          key={owner}
          owner={owner}
          pendingAcceptAction={hasPendingAcceptActions}
          pendingRejectAction={hasPendingRejectActions}
          {...props}
        />
      ))}
    </>
  )
}

export default OwnersList
