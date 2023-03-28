import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const customHeaders = {
    'Access-Control-Allow-Origin': '*'
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_AWS_DEV_API,
        // mode: "cors",
    }),
    tagTypes: ['Test', 'Answer', 'Question', 'Session'],
    endpoints: builder => ({})
})