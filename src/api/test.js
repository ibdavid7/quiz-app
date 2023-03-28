import React from 'react';
import { store, useGetTestsQuery } from "../store/store";


const Test = () => {

    // const {data, isFetching, isSuccess} = useGetTestQuery(1);
    // const [startTest, resultStartTest] = useStartTestMutation();
    // const [updateTest, result] = useSubmitResponseMutation()
    // const ans = useSelector((state) => selectAllAnswers(state, 1))

    console.log(store.getState())

    const {
        tests,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTestsQuery();


    const handleOnClickSubmitResponse = () => {


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


    return (
        <div>
            {isLoading && "Fetching data"}
            {isSuccess && tests.questions.map((q) => {
                return (<div>{q.question_text}</div>)
            })}
            <button onClick={handleOnClickSubmitResponse} >Get Tests</button>
            {/* <button onClick={() => startTest({ testId: 1, userId: "userId5" })} >Patch</button> */}
        </div>
    );
};

export default Test;
