import React from 'react'
import { Loader, LoadingContainer } from '@components/ICON'
import css from './index.module'
import Img from '@components/core/Img'

const wip = require('./assets/wip.svg')

const AddressBook = () => {
  return (
    <div className={css.root}>
      <Img style={{ display: 'block', margin: 'auto', paddingTop: '100px', opacity: '0.3' }} src={wip} width={300} height={300} />
      {/* <LoadingContainer>
        <Loader size='md' />
      </LoadingContainer> */}
    </div>
  )
}

export default AddressBook
