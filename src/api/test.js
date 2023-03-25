import React from 'react';
import {useGetTestQuery, useSubmitResponseMutation} from "../store/testSlice";
import {selectAllAnswers, store} from "../store/store";
import {useSelector} from "react-redux";


const Test = () => {

    const {data, isFetching, isSuccess} = useGetTestQuery(1);
    const [updateTest, result] = useSubmitResponseMutation()
    // const ans = useSelector((state) => selectAllAnswers(state, 1))
    console.log(store.getState())
    const handleOnClickSubmitResponse = () => {


        updateTest({
            id: 1,
            answers: {
                ...data.answers,
                question_id_1: 1,
            },
        });

        updateTest({
            id: 1,
            answers: {
                ...data.answers,
                question_id_2: 3,
            },
        });
    }


    return (
        <div>
            {isFetching && "Fetching data"}
            {isSuccess && data.questions.map((q) => {
                return (<div>{q.question_text}</div>)
            })}
            <button onClick={handleOnClickSubmitResponse} >Patch</button>
        </div>
    );
};

export default Test;
