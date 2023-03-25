import {configureStore} from "@reduxjs/toolkit";
import {testsSlice, useGetTestQuery, useSubmitResponseMutation} from "./testSlice";
import {setupListeners} from '@reduxjs/toolkit/query'

const store = configureStore({
    reducer: {
        // users: usersReducer,
        [testsSlice.reducerPath]: testsSlice.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(testsSlice.middleware)
})

setupListeners(store.dispatch);

const selectAllAnswers = (state, id) => state.tests.find(test => test.id === id)

export {store, useGetTestQuery, useSubmitResponseMutation, selectAllAnswers};