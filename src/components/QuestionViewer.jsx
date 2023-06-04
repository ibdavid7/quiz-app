import React, { useState, useEffect } from 'react';
import { Container, Header, Divider, Table, Icon, Image, Button, Progress, Grid, Segment, Label } from 'semantic-ui-react'
import {alphabet} from '../constants'

import { useGetQuestionsQuery, useGetSessionQuery, useSubmitAnswerMutation } from '../store/testsSlice';

// Controlled Component
const QuestionViewer = ({ question, questionCount, questionIndex }) => {

    const Options = ({ colsPerRow }) => {

        let r = 0, c = 0, l = question?.options?.length;

        const options = [];

        for (r = 0; r < (l + 1) / 2; r++) {
            const cols = [];
            // line.push(<Grid.Row key={r}>)
            for (c = 0; c < 2 && (r * 2 + c) < l; c++) {
                const index = r * 2 + c;
                const optionId = question?.options?.[index]?.['option_id'];
                const col = (
                    <Grid.Column width={16 / colsPerRow} key={optionId}>
                        <Segment
                            id={optionId}
                            // onClick={() => handleSelectionOnClick(optionId)}
                            className={question?.answer_id === optionId ? 'raised green' : 'basic'}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>{alphabet(index)}. </span>
                            {question?.options?.[index]?.['option_text'] && question?.options?.[index]?.['option_text']}
                            {question?.options?.[index]?.['option_image'] && <Image src={question?.options?.[index]?.['option_image']} />}
                        </Segment>
                    </Grid.Column>
                );

                cols.push(col);
            }

            options.push(
                <Grid.Row key={r}>
                    {cols}
                </Grid.Row>
            );
        }

        return (
            <Grid stackable relaxed>
                {options}
            </Grid>
        )
    }


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

                <Grid stackable>
                    <Grid.Column width={8}>
                        <Image src={question?.question_image} />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        {question.difficulty && <Label attached='bottom right'>{question.difficulty}</Label>}
                        <Options colsPerRow={2} />

                    </Grid.Column>
                </Grid>
            </Container>


            <Divider horizontal>
                <Header as='h4'>
                    <Icon name='clipboard' />
                    Answer Content
                </Header>
            </Divider>


            <Container
                style={{ marginTop: '2rem', marginBottom: '2rem' }}
                text
                dangerouslySetInnerHTML={{ __html: question?.answer_text }}
            >
            </Container>
            <Image src={question?.answer_image} fluid />


        </Container>

    )
}

export default QuestionViewer
