import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useSelector } from 'react-redux'

import Col from '@components/core/Col'
import Paragraph from '@components/core/Paragraph'
import { border, md, screenSm, sm, xs } from '@src/theme/variables'

const formatNetwork = (network) => network[0].toUpperCase() + network.substring(1).toLowerCase()

const useStyles = makeStyles({
  container: {
    flexGrow: 0,
    padding: `0 ${sm}`,
    [`@media (min-width: ${screenSm}px)`]: {
      paddingLeft: md,
      paddingRight: md
    }
  },
  text: {
    background: border,
    borderRadius: '3px',
    lineHeight: 'normal',
    margin: '0',
    padding: `${xs} ${sm}`,

    [`@media (min-width: ${screenSm}px)`]: {
      marginLeft: '8px'
    }
  }
})

const NetworkLabel = () => {
  const network = useSelector((state) => state.networkConnected)
  const classes = useStyles()
  const formattedNetwork = formatNetwork(network)

  return (
    <Col className={classes.container} middle='xs' start='xs'>
      <Paragraph className={classes.text} size='xs'>
        {formattedNetwork}
      </Paragraph>
    </Col>
  )
}

export default NetworkLabel
