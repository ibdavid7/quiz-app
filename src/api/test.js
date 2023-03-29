import React, { useState } from 'react';
import { store, useGetTestQuery, useGetTestsQuery } from "../store/store";


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
            {/* <button onClick={() => startTest({ testId: 1, userId: "userId5" })} >Patch</button> */}
        </div>
    );
};

export default Test;
