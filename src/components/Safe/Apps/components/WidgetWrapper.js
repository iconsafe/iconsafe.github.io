import React from 'react'
import styled from 'styled-components'

const Card = styled.div`
  width: 100%;
  padding: 15px;
`

const WidgetWrapper = ({ children }) => (
  <Card>
    {children}
  </Card>
)

export default WidgetWrapper
