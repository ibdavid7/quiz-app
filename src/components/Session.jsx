import React, { useState, useEffect } from 'react';
import { useGetSessionQuery } from "../store/store";
import { useLoaderData } from "react-router-dom";
import Instructions from './Instructions';
import { Icon, Button, Divider, Container, Segment, Header } from 'semantic-ui-react';
import Question from './Question';



export async function loader({ params }) {
    // console.log(params)
    return params;
}


const Session = () => {
    const { sessionId, questionNumber: questionNumberParams } = useLoaderData();
    const { data: session, refetch: sessionRefetch, isSuccess: sessionIsSuccess, isError: sessionIsError } = useGetSessionQuery(sessionId);
    const [questionCount, setQuestionCount] = useState(0);
    const [questionNumber, setQuestionNumber] = useState(-1);

    useEffect(() => {
        setQuestionCount(session?.questions?.length);
        const index = Number(questionNumberParams) && (Number(questionNumberParams) - 1) < questionCount ? Number(questionNumberParams - 1) : -1;
        setQuestionNumber(index);
    }, [session, questionCount]);


    const handleNextClickButton = () => {
        setQuestionNumber((prev) => Math.min(prev + 1, questionCount - 1));
    }

    const handlePreviousClickButton = () => {
        setQuestionNumber((prev) => Math.max(prev - 1, -1));
    }

    const handleCancelClickButton = () => {
        setQuestionNumber((prev) => prev + 1);
    }

    const handleCompleteClickButton = () => {
        setQuestionNumber((prev) => prev + 1);
    }

    // const html = parse(session?.config?.instructions);
    // console.log(session?.config?.instructions)

    const Navigation = () => {

        if (questionNumber < 0) {
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
        } else if (questionNumber < questionCount - 1) {
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

                        {questionNumber < 0
                            ? <Instructions config={{ ...session?.config, questionCount: session?.questions?.length }} />
                            : <Question question={session.questions[questionNumber]} questionNumber={questionNumber} questionCount={questionCount} sessionId={sessionId} />}
                    </>
                )
            }


            <Divider />

            <Container>
                <Navigation />
            </Container>


        </Container >
    )
}

export default Session
