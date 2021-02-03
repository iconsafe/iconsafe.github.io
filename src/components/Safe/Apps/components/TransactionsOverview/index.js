import React from 'react'
import { Text, Title } from '@components/ICON'

import WidgetWrapper from '../../components/WidgetWrapper'
import GnoForm from '@src/components/core/GnoForm'
import { OutgoingTxDescription } from '@components/Safe/Transactions/TransactionDetails/OutgoingTxDescription'
import Button from '@src/components/core/Button'
import styled from 'styled-components'

const StyledTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 5px;
`

const StyledText = styled(Text)`
  margin-bottom: 15px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  width: 100%;
`

export const TransactionsOverview = ({ outTx, subTransactions, onSubmitTransactions, clearTransaction }) => {
  return (
    <WidgetWrapper>
      <GnoForm onSubmit={(values) => onSubmitTransactions(values)}>
        {(...args) => {
          return (
            <>
              <StyledTitle size='md'>Transaction overview</StyledTitle>
              {!outTx &&
                <StyledText size='sm'>
                  Once you added a sub-transaction to your transaction, all the details of your transaction
                  <br /> will be displayed here.
                </StyledText>}

              {outTx &&
                <>
                  <OutgoingTxDescription tx={outTx} defaultOpenedRawMethodCalls={false} />

                  <ButtonContainer style={{ paddingRight: '16px' }}>
                    <Button
                      style={{ marginRight: '32px' }}
                      color='primary'
                      type='submit'
                      onClick={() => clearTransaction()}
                    >Clear Transaction
                    </Button>

                    <Button
                      disabled={!subTransactions.length}
                      color='primary'
                      type='submit'
                      variant='contained'
                    >
                      {`Submit Transaction ${subTransactions.length ? `(${subTransactions.length})` : ''}`}
                    </Button>
                  </ButtonContainer>
                </>}
            </>
          )
        }}
      </GnoForm>
    </WidgetWrapper>
  )
}
