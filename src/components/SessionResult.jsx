import React, { useState, useEffect } from 'react';
import { useCompleteSessionMutation, useGetSessionQuery } from "../store/store";
import { useLoaderData, useNavigate } from "react-router-dom";
import Instructions from './Instructions';
import { Icon, Button, Divider, Container, Segment, Header, Table, Image, Label } from 'semantic-ui-react';
import Question from './Question';
import NormalDistChart from './NormalDistChart';
import ResultsSummaryTable from './ResultsSummaryTable';
import ResultsBreakdownTable from './ResultsBreakdownTable';


export async function loader({ params }) {
    // console.log(params)
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
        //     setQuestionIndex((prev) => prev + 1);

        //     completeSession({
        //         action: 'Completed',
        //         sessionId: sessionId,
        //     })
        //         .unwrap()
        //         .then(fulfilled => {
        //             // console.log(fulfilled)
        //             sessionRefetch();

        //             setTimeout(() => {
        //                 navigate(`/sessions/${sessionId}/results`);

        //             }, 1000)

        //         })
        //         .catch(rejected => console.error(rejected))

    }


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


                            {session?.results?.summary && <ResultsSummaryTable summary={session?.results?.summary} />}


                            {session?.results?.difficulty && <ResultsBreakdownTable
                                title={'Results Breakdown by Difficulty'}
                                icon={'magnify'}
                                rows={[...Object.entries(session?.results?.difficulty)
                                    .sort(([k1, v1], [k2, v2]) => v2?.['score_available'] - v1?.['score_available'])
                                ]}
                                footer={Object.entries(session?.results?.summary).filter(([key, value]) => key == 'test')}
                            />}


                            {session?.results?.labels && <ResultsBreakdownTable
                                title={'Results Breakdown by Category'}
                                icon={'magnify'}
                                rows={[...Object.entries(session?.results?.labels)
                                    .sort(([k1, v1], [k2, v2]) => v2?.['score_available'] - v1?.['score_available'])
                                ]}
                                footer={Object.entries(session?.results?.summary).filter(([key, value]) => key == 'test')}
                            />}

                            {session?.results?.summary?.results && < NormalDistChart {...session?.results?.summary?.results} />}

                        </Container>


                        {/* <Divider horizontal>
                            <Header as='h4'>
                                <Icon name='clipboard' />
                                Breakdown By Question
                            </Header>
                        </Divider> */}

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
