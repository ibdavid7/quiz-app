import React from 'react'
import { Icon, Button, Divider, Container, Segment, Header, Table, Image, Label } from 'semantic-ui-react';


const ResultsSummaryTable = ({ summary }) => {

    const { test, results } = summary;

    const { score_available, questions_available, score_result, questions_correct } = test;
    const { score, percentile } = results;
    return (

        <Segment basic>

            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='clipboard' />
                    Results
                </Header>
            </Divider>
            <br />

            <Table definition>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width={4}>
                            <Header as="h4" textAlign="center">
                                IQ Score
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{score}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width={4}>
                            <Header as="h4" textAlign="center">
                                Percentile %
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{percentile}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width={4}>
                            <Header as="h4" textAlign="center">
                                Total Questions
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{questions_available}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width={4}>
                            <Header as="h4" textAlign="center">
                                Correct Questions
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{questions_correct}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width={4}>
                            <Header as="h4" textAlign="center">
                                Score Available
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{score_available}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width={4}>
                            <Header as="h4" textAlign="center">
                                Score Achieved
                            </Header>
                        </Table.Cell>
                        <Table.Cell>{score_result}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width={4}>
                            <Header as="h4" textAlign="center">
                                Score %
                            </Header>
                        </Table.Cell>
                        <Table.Cell>${(Number(score_result) / Number(score_available) * 100).toFixed(1)}%</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Segment >


    )
}

export default ResultsSummaryTable
