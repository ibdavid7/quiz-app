import { configureStore } from "@reduxjs/toolkit";
import {
    useGetTestsQuery, useGetTestQuery, useCreateSessionMutation,
    useGetQuestionsQuery, useSubmitAnswerMutation, useGetSessionsQuery,
    selectAllSessions, selectSessionById, selectAllTests, selectTestById,
    usePurchaseTestMutation
} from "./testsSlice";
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from "./apiSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .concat(apiSlice.middleware)
})

setupListeners(store.dispatch);

const selectAllAnswers = (state, id) => state.tests.find(test => test.id === id)

export {
    store, useGetTestsQuery, useGetTestQuery, useCreateSessionMutation,
    useGetQuestionsQuery, useSubmitAnswerMutation, selectAllAnswers,
    usePurchaseTestMutation, useGetSessionsQuery, selectAllSessions,
    selectSessionById, selectAllTests, selectTestById
};