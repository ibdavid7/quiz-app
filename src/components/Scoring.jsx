import React from 'react'
import { Container, Table } from 'semantic-ui-react'
import PlaceholderComponent from './PlaceholderComponent'
import { useGetFullTestQuery } from '../store/testsSlice'

// TODO implement

const Scoring = ({ testId }) => {

  const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);


  return (
    isTestSuccess
      ? (
        <Container>

          <Table definition>
            <Table.Body>

              <Table.Row>
                <Table.Cell width={4}>Scoring Type</Table.Cell>
                <Table.Cell>{test?.['config']?.['scoring']?.['type']}</Table.Cell>
              </Table.Row>

              {
                Object.entries(test?.['config']?.['scoring'])
                  .map(([key, val], index) => {
                    if (key !== 'type') {
                      // console.log(key)
                      return (
                        <Table.Row key={index}>
                          <Table.Cell>{key}</Table.Cell>
                          <Table.Cell>{val}</Table.Cell>
                        </Table.Row>
                      )
                    }
                  })
              }
            </Table.Body>
          </Table>
        </Container>
      )
      : (<PlaceholderComponent />)

  )
}

export default Scoring
