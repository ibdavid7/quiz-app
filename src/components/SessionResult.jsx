import React, { useState, useEffect } from 'react';
import { useCompleteSessionMutation, useGetSessionQuery } from "../store/store";
import { useLoaderData, useNavigate } from "react-router-dom";
import Instructions from './Instructions';
import { Icon, Button, Divider, Container, Segment, Header, Table, Image, Label } from 'semantic-ui-react';
import Question from './Question';
import NormalDistChart from './NormalDistChart';


export async function loader({ params }) {
    console.log(params)
    return params;
}


const SessionResult = () => {
    // TODO Fix navigation or delete
    // const { sessionId, questionNumber: questionNumberParams } = useLoaderData();
    // console.log('questionNumberParams', questionNumberParams)

    const { sessionId } = useLoaderData();
    const { data: session, refetch: sessionRefetch, isSuccess: sessionIsSuccess, isError: sessionIsError } = useGetSessionQuery(sessionId);
    const [completeSession, { data: sessionCompleteData, error: sessionCompleteError,
        isLoading: sessionCompleteIsLoading, isSuccess: sessionCompleteIsSuccess, isError: sessionCompleteIsError
    }] = useCompleteSessionMutation();

    const [questionCount, setQuestionCount] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(-1);

    const navigate = useNavigate();

    useEffect(() => {
        setQuestionCount(session?.questions?.length);
        // TODO Fix navigation or delete
        // const index = Number(questionNumberParams) && (Number(questionNumberParams) - 1) < questionCount ? Number(questionNumberParams - 1) : -1;
        // setQuestionIndex(index);
    }, [session]);

    const square = { width: 175, height: 175 }


    const handleNextClickButton = () => {
        setQuestionIndex((prev) => Math.min(prev + 1, questionCount - 1));
    }

    const handlePreviousClickButton = () => {
        setQuestionIndex((prev) => Math.max(prev - 1, -1));
    }

    const handleCancelClickButton = () => {
        setQuestionIndex((prev) => prev + 1);
    }

    const handleCompleteClickButton = () => {
        setQuestionIndex((prev) => prev + 1);

        completeSession({
            action: 'Completed',
            sessionId: sessionId,
        })
            .unwrap()
            .then(fulfilled => {
                // console.log(fulfilled)
                navigate(`/sessions/${sessionId}/results`);
            })
            .catch(rejected => console.error(rejected))

    }

    // const html = parse(session?.config?.instructions);
    // console.log(session?.config?.instructions)

    const Navigation = () => {

        if (questionIndex < 0) {
            return (
                <Segment basic floated='right'>
                    <Button icon labelPosition='left' onClick={handleCancelClickButton}>
                        <Icon name='cancel' />
                        Cancel
                    </Button>
                    <Button icon labelPosition='right' color='black' onClick={handleNextClickButton}>
                        Start
                        <Icon name='right arrow' />
                    </Button>
                </Segment>
            )
        } else if (questionIndex < questionCount - 1) {
            return (
                <Segment basic floated='right'>
                    <Button icon labelPosition='left' onClick={handlePreviousClickButton}>
                        <Icon name='left arrow' />
                        Previous
                    </Button>
                    <Button icon labelPosition='right' color='black' onClick={handleNextClickButton}>
                        Next
                        <Icon name='right arrow' />
                    </Button>
                </Segment>
            )
        } else {
            return (
                <Segment basic floated='right' >
                    <Button icon labelPosition='left' onClick={handlePreviousClickButton}>
                        <Icon name='left arrow' />
                        Previous
                    </Button>
                    <Button icon labelPosition='right' color='black' onClick={handleCompleteClickButton}>
                        Complete
                        <Icon name='flag checkered' />
                    </Button>
                </Segment >
            )
        }
    }


    return (
        <Container style={{ marginTop: '5rem', marginBottom: '5rem' }}>
            {/* {JSON.stringify(session)} */}
            {sessionIsSuccess
                && (
                    <>
                        <Header as='h1' textAlign='left'>{session?.config?.label}</Header>
                        <p>{JSON.stringify(session.results)}</p>

                        {/* ---------------------------------------- */}

                        <Container fluid>

                            <Divider horizontal>
                                <Header as='h4'>
                                    <Icon name='clipboard' />
                                    Results
                                </Header>
                            </Divider>



                            <Table definition>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell width={4}>IQ Score</Table.Cell>
                                        <Table.Cell>{120}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>

                            <Table definition celled>

                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell></Table.HeaderCell>
                                        <Table.HeaderCell>Questions Available</Table.HeaderCell>
                                        <Table.HeaderCell>Questions Answered</Table.HeaderCell>
                                        <Table.HeaderCell>Questions Correct</Table.HeaderCell>
                                        <Table.HeaderCell>% Correct</Table.HeaderCell>
                                        <Table.HeaderCell>Score Available</Table.HeaderCell>
                                        <Table.HeaderCell>Score Achieved</Table.HeaderCell>
                                        <Table.HeaderCell>Score %</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>

                                    {Object.entries(session.results).map(([key, value], index) => {
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell>{key}</Table.Cell>
                                                <Table.Cell>{value['questions_available']}</Table.Cell>
                                                <Table.Cell>{value['questions_answered']}</Table.Cell>
                                                <Table.Cell>{value['questions_correct']}</Table.Cell>
                                                <Table.Cell>{`${(Number(value['questions_correct']) / Number(value['questions_answered']) * 100).toFixed(0)}%`}</Table.Cell>
                                                <Table.Cell>{value['score_available']}</Table.Cell>
                                                <Table.Cell>{value['score_result']}</Table.Cell>
                                                <Table.Cell>{`${(Number(value['score_result']) / Number(value['score_available']) * 100).toFixed(0)}%`}</Table.Cell>
                                            </Table.Row>
                                        )

                                    })}


                                </Table.Body>
                            </Table>

                            {/* <Image src={session?.config?.instructions_image} fluid /> */}


                            {/* <Divider horizontal>
                                <Header as='h4'>
                                    <Icon name='clipboard' />
                                    Results Percentile %
                                </Header>
                            </Divider> */}


                            <Container

                            >
                                <Segment>


                                    < NormalDistChart />
                                    <Segment circular style={{ ...square, position: 'absolute', top: '20%', right: '1%', transform: 'translate(-50%, -50%)',verticalAlign: 'middle' }}>
                                    <Header as='h2' textAlign='center' style={{verticalAlign: 'middle'}}>
                                            120
                                            <Header.Subheader>IQ Score</Header.Subheader>
                                        </Header>
                                        <Header as='h2' textAlign='center' style={{verticalAlign: 'middle'}}>
                                            80%
                                            <Header.Subheader>Percentile</Header.Subheader>
                                        </Header>
                                    </Segment>

                                </Segment>

                            </Container>

                        </Container>


                        <Divider horizontal>
                            <Header as='h4'>
                                <Icon name='clipboard' />
                                Breakdown By Question
                            </Header>
                        </Divider>

                        <Container>
                            <Navigation />
                        </Container>


                        {/* ---------------------------------------- */}

                    </>
                )
            }





        </Container >
    )
}

export default SessionResult
