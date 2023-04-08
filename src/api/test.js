import React, { useState } from 'react';
import { store, useGetTestQuery, useGetTestsQuery, useCreateSessionMutation } from "../store/store";
import { selectAllSessions, useGetSessionQuery, useGetSessionsQuery, useSubmitAnswerMutation } from '../store/testsSlice';
import LoginForm from '../components/Login';
import { useSelector } from 'react-redux';


const Test = () => {

    // const {data, isFetching, isSuccess} = useGetTestQuery(1);
    // const [startTest, resultStartTest] = useStartTestMutation();
    // const [updateTest, result] = useSubmitResponseMutation()
    // const ans = useSelector((state) => selectAllAnswers(state, 1))

    // console.log(store.getState())

    const { data: mySessions, refetch: sessionsRefetch } = useGetSessionsQuery();
    const sessions = useSelector(selectAllSessions)

    const {
        data: tests = [],
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTestsQuery();

    const [sessionId, setSessionId] = useState();
    const { data: session, refetch: sessionRefetch } = useGetSessionQuery('fb69b4a9-47e7-4e74-bf51-8c9bd9d08cad');

    const [submitAnswer, { data: submitAnswerResponse, isSuccess: submitAnswerIsSuccess }] = useSubmitAnswerMutation();

    const [createSession, { data: createSessionResponse, isSuccess: createSessionIsSuccess }] = useCreateSessionMutation();

    const [testId, setTestId] = useState(1);

    const { data: test, isLoading: isTestLoading, isSuccess: isTestSuccess, refetch: refetchTest } = useGetTestQuery(testId);


    const handleOnClickSubmitResponse = () => {

        setTestId((prev) => prev + 1);

        // updateTest({
        //     id: 1,
        //     answers: {
        //         ...data.answers,
        //         question_id_1: 1,
        //     },
        // });

        // updateTest({
        //     id: 1,
        //     answers: {
        //         ...data.answers,
        //         question_id_2: 3,
        //     },
        // });

    }

    const handleOnClickSubmitAnswer = () => {
        submitAnswer({
            sessionId: '9f2b15a4-630f-4f3e-b880-1e462f7f2853',
            questionId: '1a',
            optionId: 'BBBBBBB',
        })

    }

    const handleOnClickCreateSession = () => {
        createSession({
            testId: 1,
        });
    }

    // console.log(tests)
    // console.log(isTestSuccess)

    return (
        <div>
            {isLoading && "Fetching data"}

            {isSuccess && tests.ids.map((testId) => {
                // console.log(`${tests.entities[testId]['config']['label']} - id: ${testId}`)
                return (<div key={testId}>{tests.entities[testId]['config']['label']} - id: {testId}</div>)
            })}

            {isTestSuccess && (<div>{JSON.stringify(test)}</div>)}
            <button onClick={handleOnClickSubmitResponse} >Get Tests</button>
            <div>{JSON.stringify(session)}</div>
            {/* <button onClick={() => startTest({ testId: 1, userId: "userId5" })} >Patch</button> */}
            <button onClick={sessionRefetch} >Session Refetch</button>
            <div></div>
            <button onClick={handleOnClickSubmitAnswer} >Submit Answer</button>
            <div>{submitAnswerIsSuccess && JSON.stringify(submitAnswerResponse)}</div>
            <button onClick={handleOnClickCreateSession} >Create Session</button>

            <div>My Sessions:</div>
            <div>{sessions.map((session) => {
                return (
                    <div key={session.id}>{session.id}</div>
                )
            })}</div>
            <button onClick={sessionsRefetch}>Refetch My Sessions</button>
            <LoginForm />
        </div>
    );
};

export default Test;
