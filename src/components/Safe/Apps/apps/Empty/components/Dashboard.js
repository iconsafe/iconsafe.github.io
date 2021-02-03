import { Text, Title } from '@components/ICON'
import Button from '@src/components/core/Button'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import WidgetWrapper from '@components/Safe/Apps/components/WidgetWrapper'
import GnoForm from '@src/components/core/GnoForm'
import { styles } from './style'
import { makeStyles } from '@material-ui/core/styles'
import Col from '@src/components/core/Col'
import { useSelector } from 'react-redux'

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`

const StyledText = styled(Text)`
  margin-bottom: 15px;
`

const useStyles = makeStyles(styles)

const Dashboard = ({ subTransactions, setSubTransactions }) => {
  const safeAddress = useSelector((state) => state.safeAddress)
  const onSubmitAddress = (values) => { }

  useEffect(() => {
    Promise.all([
    ]).then(results => {
      // const [] = results
    })
  }, [safeAddress])

  const formMutators = {
  }

  const classes = useStyles()

  return (
    <WidgetWrapper>

      <GnoForm formMutators={formMutators} onSubmit={(values) => onSubmitAddress(values)}>
        {(...args) => {
          // const mutators = args[3]
          return (
            <>
              <StyledTitle size='sm'>Title</StyledTitle>
              <StyledText size='sm'>Description</StyledText>

              <Col style={{ marginTop: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} />
              {/* Submit */}
              <div style={{ height: '55px' }}>
                <Button
                  className={classes.buttonSubmit}
                  color='primary'
                  type='submit'
                  variant='contained'
                >
                  Add sub-transaction
                </Button>
              </div>
            </>
          )
        }}
      </GnoForm>

    </WidgetWrapper>
  )
}

export default Dashboard
