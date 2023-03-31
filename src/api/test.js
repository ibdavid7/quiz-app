import React, { useState } from 'react';
import { store, useGetTestQuery, useGetTestsQuery } from "../store/store";
import { useGetSessionQuery, useSubmitAnswerMutation } from '../store/testsSlice';


const Test = () => {

    // const {data, isFetching, isSuccess} = useGetTestQuery(1);
    // const [startTest, resultStartTest] = useStartTestMutation();
    // const [updateTest, result] = useSubmitResponseMutation()
    // const ans = useSelector((state) => selectAllAnswers(state, 1))

    // console.log(store.getState())

    const {
        data: tests = [],
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTestsQuery();

    const [sessionId, setSessionId] = useState();
    const { data: session, refetch: sessionRefetch } = useGetSessionQuery('9f020ddb-d0bb-4856-902a-7e49287999f2');

    const [submitAnswer] = useSubmitAnswerMutation();

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
            sessionId: '9f020ddb-d0bb-4856-902a-7e49287999f2',
            answerId: '1',
            optionId: '2',
        })
    }

    // console.log(tests)
    console.log(isTestSuccess)

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
        </div>
    );
};

export default Test;
