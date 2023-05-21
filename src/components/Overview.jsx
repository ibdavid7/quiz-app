import React from 'react'
import { Container, Placeholder, Header, Icon, Button } from 'semantic-ui-react'
import PlaceholderComponent from './PlaceholderComponent'
import { useGetFullTestQuery } from '../store/testsSlice'


// TODO implement
const Overview = ({ testId, mobile }) => {
    // console.log('testId:', testId)
    const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);


    return (
        <Container style={{ marginTop: '2rem', marginBottom: '2rem' }} text>
            {isTestSuccess
                ? (
                    <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>

                        <Container>
                            <Header as={'h1'}>{test?.['product_summary']?.['title']}</Header>
                            <Header as={'h3'}>{test?.['product_summary']?.['subtitle']}</Header>
                        </Container>


                        <Container
                            style={{ marginTop: '2rem', marginBottom: '2rem' }}
                            text
                            dangerouslySetInnerHTML={{ __html: test?.product_summary?.overview }}
                        ></Container>
                    </Container>
                )
                : <PlaceholderComponent />}

        </Container>
    )
}

export default Overview
