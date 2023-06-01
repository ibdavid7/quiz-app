import { Container, Header, Divider, Table, Icon, Image, Button } from 'semantic-ui-react';
import { useGetFullTestQuery } from '../store/testsSlice';
import PlaceholderComponent from './PlaceholderComponent';

const InstructionsTestDisplay = ({ testId }) => {

    const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);


    return (
        isTestSuccess
            ? (
                <Container>
                    <Container fluid>
                        <Divider horizontal>
                            <Header as='h4'>
                                <Icon name='clipboard' />
                                Instructions
                            </Header>
                        </Divider>

                        <Table definition>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={4}>Number of Questions</Table.Cell>
                                    <Table.Cell>{test?.config?.questionCount}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>Recommended time limit</Table.Cell>
                                    <Table.Cell>{test?.config?.duration}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <div dangerouslySetInnerHTML={{ __html: test?.config?.instructions }} />
                        <Image src={test?.config?.instructions_image} fluid />
                    </Container>
                </Container>
            )
            : (<PlaceholderComponent />)
    )
}

export default InstructionsTestDisplay
