import React, { useState, useEffect } from 'react';
import { Container, Header, Divider, Table, Icon, Image, Button, Progress, Grid, Segment, Label } from 'semantic-ui-react'
import alphabet from '../constants/alphabet';
import { useGetQuestionsQuery, useGetSessionQuery, useSubmitAnswerMutation } from '../store/testsSlice';

const Question = ({ question, questionCount, questionNumber, sessionId }) => {

    const [selectionId, setSelectionId] = useState(null);
    const { data: session, refetch: sessionRefetch, isSuccess: sessionIsSuccess, isError: sessionIsError } = useGetSessionQuery(sessionId);
    const [submitAnswer, resultSubmitAnswer] = useSubmitAnswerMutation();

    const [STARTED] = ['Started'];

    useEffect(() => {
        setSelectionId(session?.['answers']?.[question.question_id] || null)
    }, [session, question]);


    const handleSelectionOnClick = (optionId) => {

        // only edit answer if session.status is started
        if (session.status !== STARTED) {
            return;
        }

        setSelectionId((prevId) => {
            if (prevId === optionId) {
                submitAnswer({ sessionId: sessionId, questionId: question.question_id, optionId: null });
                return null;
            } else {
                submitAnswer({ sessionId: sessionId, questionId: question.question_id, optionId: optionId });
                return optionId;
            }
        })
    }


    const Options = ({ colsPerRow }) => {

        let r = 0, c = 0, l = question.options.length;

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
                            onClick={() => handleSelectionOnClick(optionId)}
                            className={selectionId === optionId ? 'raised black' : 'basic'}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>{alphabet(index)}. </span>
                            {question?.options?.[index]?.['option_text'] && question.options[index]['option_text']}
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

            {/* <div>
                {JSON.stringify(question)}
            </div> */}

            <Divider horizontal>
                <Header as='h4' >
                    <Segment.Inline>
                        <Icon name='check circle' color='black' />
                        Question {questionNumber + 1} / {questionCount} ({Math.max(100, ((questionNumber + 1) / (questionCount) * 100).toFixed(0))}%)
                        {/* <Progress value={questionNumber + 1} total={questionCount} progress='percent' /> */}
                    </Segment.Inline>
                </Header>
            </Divider>

            <Header>{question.question_text}</Header>

            <Container fluid>

                <Grid stackable>
                    <Grid.Column width={8}>
                        <Image src='https://react.semantic-ui.com/images/wireframe/image.png' />
                    </Grid.Column>
                    <Grid.Column width={8}>
                        {question.difficulty && <Label attached='bottom right'>{question.difficulty}</Label>}
                        {/*<Grid stackable>

                            <Grid.Row>
                                <Grid.Column width={8} >
                                    A.
                                    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    B.
                                    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column width={8}>
                                    C.
                                    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    D.
                                    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                                </Grid.Column >
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column width={8}>
                                    E.
                                    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                                </Grid.Column>

                            </Grid.Row>
                        </Grid>
                        */}
                        <Options colsPerRow={2} />

                    </Grid.Column>
                </Grid>
            </Container>
        </Container>

    )
}

export default Question
