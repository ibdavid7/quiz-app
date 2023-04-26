import React from 'react';
import { useGetSessionQuery } from "../store/store";
import { useLoaderData } from "react-router-dom";


export async function loader({ params }) {
    // const { data: session, refetch: sessionRefetch } = useGetSessionQuery(sessionId);
    // const sessionId = await getContact(params.sessionId);
    // return { sessionId };
    // console.log(params);
    return params;
}


const Session = () => {
    const { sessionId } = useLoaderData();

    // console.log(sessionId);

    const { data: session, refetch: sessionRefetch } = useGetSessionQuery(sessionId);



    return (
        <div>
            {JSON.stringify(session)}
        </div>
    )
}

export default Session
