import React from 'react'
import Block from '@src/components/core/Block'
import Bold from '@src/components/core/Bold'
import { ICONTrackerLink } from '@components/ICON'
import { displayUnit } from '@src/utils/icon'
import { styles } from './styles'
import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles(styles)

const RawMethodCallDescription = ({
  amount,
  params,
  description,
  methodName,
  address
}) => {
  const classes = useStyles()

  return (
    <Block className={classes.transactionDescriptionContainer}>
      <List component='div' disablePadding>

        <ListItem classes={{ root: classes.item }}>
          <Bold className={classes.boldTitle}>Address: </Bold>
          <Box fontFamily='Monospace'><ICONTrackerLink value={address} /></Box>
        </ListItem>

        {!amount.isEqualTo(0) &&
          <ListItem classes={{ root: classes.item }}>
            <Bold className={classes.boldTitle}>Amount: </Bold>
            <Box fontFamily='Monospace'>{displayUnit(amount, 18)} ICX</Box>
          </ListItem>}

        {methodName &&
          <ListItem classes={{ root: classes.item }}>
            <Bold className={classes.boldTitle}>Method: </Bold>
            <Box fontFamily='Monospace'>{methodName}</Box>
          </ListItem>}

        {params && Object.keys(params).length !== 0 &&
          <ListItem classes={{ root: classes.item }}>
            <Bold className={classes.boldTitle}>Params: </Bold>
            <List component='div' disablePadding>
              {params.map((param, index) => (
                <ListItem key={index} classes={{ root: classes.item }}>
                  <Box fontFamily='Monospace' className={classes.paramName}>{param.name}: </Box>
                  <Box fontFamily='Monospace' className={classes.paramType}>{param.type}</Box>
                  <Box fontFamily='Monospace' className={classes.paramValue}> = <span style={{ whiteSpace: 'normal !important', maxWidth: '500px', width: '500px', wordWrap: 'break-word' }}>{param.value}</span></Box>
                </ListItem>
              ))}
            </List>
          </ListItem>}

        {description !== '' &&
          <ListItem classes={{ root: classes.item }}>
            <Bold className={classes.boldTitle}>Description: </Bold>
            <Box fontFamily='Monospace'>{description}</Box>
          </ListItem>}
      </List>
    </Block>
  )
}

export default RawMethodCallDescription
