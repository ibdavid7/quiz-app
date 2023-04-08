import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery, injectEndpoints } from '@reduxjs/toolkit/query/react';
import { schema, normalize } from 'normalizr';
import { apiSlice } from './apiSlice';

const testsAdapter = createEntityAdapter();
const testsInitialState = testsAdapter.getInitialState();


const sessionsAdapter = createEntityAdapter();
const sessionsInitialState = sessionsAdapter.getInitialState();

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
        // TODO - allow for unregistered users to start sessions and get previews, but also cache and remember answers - maybe init locally
        createSession: builder.mutation({
            query: (body) => {
                return {
                    url: `/sessions`,
                    method: 'POST',
                    body,
                    // validateStatus: (response, result) => response.status === 200 && !result.isError, // Our tricky API always returns a 200, but sets an `isError` property when there is an error.
                }
            },
            invalidatesTags: (result, error, arg) => [
                { type: 'Session', id: 'LIST' }
            ],
        }),
        // TODO - get user sessions
        getSessions: builder.query({
            query: () => {
                return {
                    url: `/sessions`,
                    method: 'GET',
                    // validateStatus: (response, result) => response.status === 200 && !result.isError, // Our tricky API always returns a 200, but sets an `isError` property when there is an error.
                }
            },
            providesTags: (result = [], error, arg) => [
                { type: 'Session', id: 'LIST' },
                ...result.ids.map(({ id }) => ({ type: 'Session', id }))
            ],
            transformResponse: responseData => {
                return sessionsAdapter.setAll(sessionsInitialState, responseData)
            },
        }),

        // TODO will require userID in the body
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
        // TODO - likely for API only
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
            async onQueryStarted({ sessionId, questionId, optionId }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getSession', sessionId, (draft) => {
                        draft.answers[questionId]['answer'] = optionId;
                    })
                )
                queryFulfilled.catch(patchResult.undo)
            },

        }),

        // TODO invalidates getSession, action: complete, build authentication
        // completeSession:

    }),
})


// Test Adaptor and memoized selector
export const selectTestsResult = extendedApiSlice.endpoints.getTests.select()

const selectTestsData = createSelector(
    selectTestsResult,
    testsResult => testsResult.data
)

export const { selectAll: selectAllTests, selectById: selectTestById } =
    testsAdapter.getSelectors(state => selectTestsData(state) ?? testsInitialState)


// Sessions Adaptor and memoized selector
export const selectSessionsResult = extendedApiSlice.endpoints.getSessions.select()

const selectSessionsData = createSelector(
    selectSessionsResult,
    sessionsResult => sessionsResult.data
)

export const { selectAll: selectAllSessions, selectById: selectSessionById } =
    sessionsAdapter.getSelectors(state => selectSessionsData(state) ?? sessionsInitialState)

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
    useGetQuestionsQuery, useSubmitAnswerMutation, useGetSessionQuery,
    useGetSessionsQuery,
} = extendedApiSlice;