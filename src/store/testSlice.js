import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

// Define our single API slice object
export const testsSlice = createApi({
    // The cache reducer expects to be added at `state.api` (already default - this is optional)
    reducerPath: 'tests',
    // All of our requests will have URLs starting with '/fakeApi'
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_JSON_SERVER_API
    }),
    // The "endpoints" represent operations and requests for this server
    endpoints: builder => ({
        // The `getPosts` endpoint is a "query" operation that returns data
        getTest: builder.query({
            query: testId => `/tests/${testId}`,
            providesTags: (result, error, testId) => [{ type: 'Tests', testId }],
        }),
        submitResponse: builder.mutation({
            query: ({id, ...patch}) => {
                return {
                    url: `tests/${id}`,
                    method: 'PATCH',
                    body: patch,
                }
            },
            invalidatesTags: (result, error, { id }) => [{ type: 'Tests', id }],
        }),
    })
})


// Export the auto-generated hook for the `getPosts` query endpoint
export const {useGetTestQuery, useSubmitResponseMutation} = testsSlice;