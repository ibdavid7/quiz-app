import { Container, Header, Divider, Table, Icon, Image, Button } from 'semantic-ui-react'

const Instructions = ({ config }) => {
    return (
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
                            <Table.Cell>{config?.questionCount}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Recommended time limit</Table.Cell>
                            <Table.Cell>{'90 Minutes'}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>

                <div dangerouslySetInnerHTML={{ __html: config?.instructions }} />
                <Image src={config?.instructions_image} fluid />

            </Container>
        </Container>
    )
}

export default Instructions
