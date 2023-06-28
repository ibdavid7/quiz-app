import React, { useState, useEffect } from 'react';
import { Container, Header, Divider, Table, Icon, Image, Button, Progress, Grid, Segment, Label, Card } from 'semantic-ui-react'
import { alphabet } from '../constants'
import { LayoutValue } from '../constants/layouts';
import DOMPurify from "dompurify";

// Controlled Component
const QuestionViewer = ({ question, questionCount, questionIndex }) => {


    const myHtml = question.answer_text;
    const mySafeHtml = DOMPurify.sanitize(myHtml);

    const optionStyle = question?.answer

    return (
        <Container>
            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='clipboard' />
                    Question Metadata
                </Header>
            </Divider>

            <Table definition>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width={4}>Question Id</Table.Cell>
                        <Table.Cell>{question?.question_id}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell >Questions Label</Table.Cell>
                        <Table.Cell>{question?.label}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Question Type</Table.Cell>
                        <Table.Cell>{question?.type}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Question Difficulty</Table.Cell>
                        <Table.Cell>{question?.difficulty}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Question Score</Table.Cell>
                        <Table.Cell>{question?.score}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>Layout</Table.Cell>
                        <Table.Cell>{question?.layout}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>

            <Divider horizontal>
                <Header as='h4' >
                    <Segment.Inline>
                        <Icon name='check circle' color='black' />
                        Question {questionIndex + 1} / {questionCount} ({Math.max(100, ((questionIndex + 1) / (questionCount) * 100).toFixed(0))}%)
                    </Segment.Inline>
                </Header>
            </Divider>

            <Header>{question?.question_text}</Header>

            <Container fluid>

                <Grid
                    columns={LayoutValue[question?.layout]?.['grid_cols'] ?? LayoutValue['compact']?.['grid_cols']}
                    stackable
                >
                    <Grid.Column
                        // width={8}
                        width={LayoutValue[question?.layout]?.['question_col'] ?? LayoutValue['compact']?.['question_col']}

                    >

                        <Image src={question?.question_image} />

                    </Grid.Column>

                    <Grid.Column
                        width={LayoutValue[question?.layout]?.['answers_col'] ?? LayoutValue['compact']?.['answers_col']}
                    >
                        {question?.difficulty && <Label attached='bottom right'>{question.difficulty}</Label>}

                        {/* <Options colsPerRow={2} /> */}

                        <Grid
                            columns={LayoutValue[question?.layout]?.['cols_per_answer_col'] ?? LayoutValue['compact']?.['cols_per_answer_col']}
                            stackable
                        >

                            {question?.options.map(({ option_id, option_text, option_image }, index) => {
                                return (



                                    <Grid.Column
                                        key={option_id}
                                        width={LayoutValue[question?.layout]?.['answer_subCol'] ?? LayoutValue['compact']?.['answer_subCol']}
                                    >
                                        <Card
                                            fluid
                                            key={option_id}
                                            raised
                                            style={{cursor: 'pointer'}}
                                            // color={watch('answer.answer_id') === (value.option_id) ? 'green' : 'grey'}
                                            // className={watch('answer.answer_id') === (value.option_id) ? 'ui raised green' : 'ui raised'}
                                            // style={
                                            //     question?.answer_id === option_id
                                            //         ? {
                                            //             cursor: 'pointer', outlineColor: '#4caf50',
                                            //             outlineStyle: 'solid', outlineRadius: '8px', outlineWidth: 'thick',
                                            //             boxShadow: '0 0 15px 12px #a5d6a7'
                                            //         }
                                            //         : {
                                            //             cursor: 'pointer'
                                            //         }
                                            // }
                                        // color={'green'}
                                        >

                                            <Card.Content>
                                                <Card.Header>{`${alphabet(index)}`}</Card.Header>
                                                
                                                {
                                                    option_text &&
                                                    <Card.Description>
                                                        {option_text}
                                                    </Card.Description>
                                                }

                                            </Card.Content>

                                            {option_image &&
                                                <Image
                                                    wrapped ui={false}
                                                    size={'large'} src={option_image}
                                                />
                                            }

                                        </Card>

                                    </Grid.Column>
                                )
                            })}

                        </Grid>
                    </Grid.Column>
                </Grid>
            </Container>


            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='clipboard' />
                    Answer Explanation
                </Header>
            </Divider>


            {
                mySafeHtml &&
                <Container
                    style={{ marginTop: '2rem', marginBottom: '2rem' }}
                    text
                    dangerouslySetInnerHTML={{ __html: mySafeHtml }}
                >
                </Container>
            }
            {
                question?.answer_image &&
                <Image src={question?.answer_image} fluid />
            }


        </Container>

    )
}

export default QuestionViewer
