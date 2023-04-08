import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Auth } from '@aws-amplify/auth';


const customHeaders = {
    'Access-Control-Allow-Origin': '*'
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_AWS_DEV_API,
        prepareHeaders: async (headers, { endpoint }) => {
            // TODO: exclude endpoints that do not require Authorization header            
            const token = await Auth.currentSession().then((session) => session.getIdToken().getJwtToken());
            if (token) {
                headers.set('Authorization', token);
            }
            return headers;
        },
    }),
    tagTypes: ['Test', 'Answer', 'Question', 'Session'],
    endpoints: builder => ({})
})