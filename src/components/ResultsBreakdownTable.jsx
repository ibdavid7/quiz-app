import React from 'react'
import { Icon, Button, Divider, Container, Segment, Header, Table, Image, Label } from 'semantic-ui-react';


const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const ResultsBreakdownTable = ({ title, icon, rows, footer }) => {

    const { test } = footer;

    return (
        <Segment basic>
            <Divider horizontal>
                <Header as='h4'>
                    {icon && <Icon name={icon} />}
                    {title}
                </Header>
            </Divider>

            <br />

            <Table definition celled>

                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        <Table.HeaderCell>Questions Total</Table.HeaderCell>
                        <Table.HeaderCell>Questions Correct</Table.HeaderCell>
                        <Table.HeaderCell>Questions %</Table.HeaderCell>
                        <Table.HeaderCell>Score Available</Table.HeaderCell>
                        <Table.HeaderCell>Score Achieved</Table.HeaderCell>
                        <Table.HeaderCell>Score %</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>

                    {rows.map(([key, value], index) => {
                        return (
                            <Table.Row key={index}>
                                <Table.Cell>{capitalize(key)}</Table.Cell>
                                <Table.Cell>{value['questions_available']}</Table.Cell>
                                <Table.Cell>{value['questions_correct']}</Table.Cell>
                                <Table.Cell>{`${(Number(value['questions_correct']) / Number(value['questions_answered']) * 100).toFixed(0)}%`}</Table.Cell>
                                <Table.Cell>{value['score_available']}</Table.Cell>
                                <Table.Cell>{value['score_result']}</Table.Cell>
                                <Table.Cell>{`${(Number(value['score_result']) / Number(value['score_available']) * 100).toFixed(0)}%`}</Table.Cell>
                            </Table.Row>
                        )

                    })}


                </Table.Body>

                {footer &&

                    <Table.Footer>

                        {footer.map(([key, value], index) => {
                            return (
                                <Table.Row key={index}>

                                    <Table.HeaderCell></Table.HeaderCell>
                                    <Table.HeaderCell>{value['questions_available']}</Table.HeaderCell>
                                    <Table.HeaderCell>{value['questions_correct']}</Table.HeaderCell>
                                    <Table.HeaderCell>{`${(Number(value['questions_correct']) / Number(value['questions_answered']) * 100).toFixed(0)}%`}</Table.HeaderCell>
                                    <Table.HeaderCell>{value['score_available']}</Table.HeaderCell>
                                    <Table.HeaderCell>{value['score_result']}</Table.HeaderCell>
                                    <Table.HeaderCell>{`${(Number(value['score_result']) / Number(value['score_available']) * 100).toFixed(0)}%`}</Table.HeaderCell>

                                </Table.Row>
                            )

                        })}

                    </Table.Footer>}

            </Table>

        </Segment>
    )
}

export default ResultsBreakdownTable
