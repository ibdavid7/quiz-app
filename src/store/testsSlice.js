import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery, injectEndpoints } from '@reduxjs/toolkit/query/react';
import { schema, normalize } from 'normalizr';
import { apiSlice } from './apiSlice';

const testsAdapter = createEntityAdapter()
const testsInitialState = testsAdapter.getInitialState()

// const questionsAdapter = createEntityAdapter();
// const questionsInitialState = questionsAdapter.getInitialState();

// const answersAdapter = createEntityAdapter();
// const answersInitialState = answersAdapter.getInitialState();

// Define our single API slice object

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({

        // no userID required so no body of the request
        getTests: builder.query({
            query: () => {
                return {
                    url: '/tests',
                    method: 'GET',
                }
            },
            providesTags: (result = [], error, arg) => {
                return ([
                    { type: 'Test', id: 'LIST' },
                    ...result.ids.map(({ id }) => ({ type: 'Test', id }))
                ]);
            },
            transformResponse: responseData => {
                return testsAdapter.setAll(testsInitialState, responseData)
            },

        }),

        getTest: builder.query({
            query: (testId) => {
                return {
                    url: `/tests/${testId}`,
                    method: 'GET',
                }
            },
            providesTags: (result, error, testId) => [
                { type: 'Test', id: testId }
            ],
        }),

        createTest: builder.mutation({
            query: (body) => {
                return {
                    url: `/tests`,
                    method: 'POST',
                    body,
                }
            },
            invalidatesTags: (result, error, arg) => [
                { type: 'Test', id: 'LIST' }
            ],
        }),

        createSession: builder.mutation({
            query: (body) => {
                return {
                    url: `/sessions`,
                    method: 'POST',
                    body,
                }
            },
            invalidatesTags: (result, error, arg) => [
                { type: 'Session', id: 'LIST' }
            ],
        }),

        getSessions: builder.query({
            query: (body) => {
                return {
                    url: `/sessions`,
                    method: 'GET',
                    body,
                }
            },
            providesTags: (result = [], error, arg) => [
                { type: 'Session', id: 'LIST' },
                ...result.map(({ id }) => ({ type: 'Session', id }))
            ],
        }),

        // will require userID in the body
        getSession: builder.query({
            query: (sessionId) => {
                return {
                    url: `/sessions/${sessionId}`,
                    method: 'GET',
                }
            },
            providesTags: (result, error, { sessionId }) => [
                { type: 'Session', id: sessionId }
            ],
            transformResponse: responseData => {
                const data = { questions: responseData.questions };
                const questionSchema = new schema.Entity('questions', {}, { idAttribute: 'question_id' });
                const mySchema = { questions: [questionSchema] };
                const normalizedData = normalize(data, mySchema);

                return { ...responseData, ...normalizedData };
            },
        }),

        getQuestions: builder.query({
            query: (body) => {
                return {
                    url: `/sessions/${body.sessionId}/questions`,
                    method: 'GET',
                    body,
                }
            },
            providesTags: (result = [], error, arg) => [
                { type: 'Question', id: 'LIST' },
                ...result.map(({ question_id }) => ({ type: 'Question', id: question_id }))
            ],
        }),

        submitAnswer: builder.mutation({
            query: (body) => {
                return {
                    url: `sessions/${body.sessionId}/answers`,
                    method: 'PATCH',
                    body,
                }
            },
            // TODO implement optimistic updates and offline service worker logic
        }),

    }),
})


export const selectTestsResult = extendedApiSlice.endpoints.getTests.select()

const selectTestsData = createSelector(
    selectTestsResult,
    testsResult => testsResult.data
)

// export const selectSessionResult = extendedApiSlice.endpoints.getSession.select()


// const selectQuestionsData = createSelector(
//     selectSessionResult,
//     sessionResult => testsResult.data
// );

export const { selectAll: selectAllTests, selectById: selectTestById } =
    testsAdapter.getSelectors(state => selectTestsData(state) ?? testsInitialState)

// export const testsSlice = createApi({
//     // The cache reducer expects to be added at `state.api` (already default - this is optional)
//     reducerPath: 'tests',
//     // All of our requests will have URLs starting with '/fakeApi'
//     baseQuery: fetchBaseQuery({
//         baseUrl: process.env.REACT_APP_AWS_DEV_API
//     }),
//     // The "endpoints" represent operations and requests for this server
//     endpoints: builder => ({
//         // The `getPosts` endpoint is a "query" operation that returns data
//         getTest: builder.query({
//             query: testId => `/tests/${testId}`,
//             providesTags: (result, error, testId) => [{ type: 'Tests', testId }],
//         }),
//         startTest: builder.mutation({
//             query: (body) => {
//                 return {
//                     url: `/tests/${body.testId}`,
//                     method: 'POST',
//                     body,
//                 }
//             },
//             providesTags: (result, error, testId) => [{ type: 'Tests', testId }],
//         }),
//         submitResponse: builder.mutation({
//             query: ({ id, ...patch }) => {
//                 return {
//                     url: `tests/${id}`,
//                     method: 'PATCH',
//                     body: patch,
//                 }
//             },
//             invalidatesTags: (result, error, { id }) => [{ type: 'Tests', id }],
//         }),
//     })
// })


// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetTestsQuery, useGetTestQuery, useCreateSessionMutation,
    useGetQuestionsQuery, useSubmitAnswerMutation, useGetSessionQuery
} = extendedApiSlice;