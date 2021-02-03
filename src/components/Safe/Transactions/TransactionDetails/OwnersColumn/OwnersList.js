import React from 'react'

import OwnerComponent from './OwnerComponent'

const OwnersList = ({ tx, arrayOwners, ...props }) => {
  return (
    <>
      {arrayOwners.map(ownerUid => (
        <OwnerComponent confirmed tx={tx} key={ownerUid} currentOwnerUid={ownerUid} {...props} />
      ))}
    </>
  )
}

export default OwnersList
