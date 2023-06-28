import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Provider } from "react-redux";
import { store } from "./store/store";

import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Layout from './components/Layout';
import ErrorPage from './components/ErrorPage';
import Listing from './components/Card';
import Session, { loader as sessionLoader } from './components/Session';
import SessionResult, { loader as sessionResultLoader } from './components/SessionResult';
import TestEditForm from './components/TestEditForm';
import Card from './components/Card';
import TestCreateNew from './components/TestCreateNew';
import { loader as testEditLoader } from './components/TestEditForm';
import Editable from './components/Editable';
import LoginFormModal from './components/LoginFormModal';
import { Authenticator } from '@aws-amplify/ui-react';
import { EDIT_TEST_SECTIONS } from './constants/editTestSections';
import TestEditLayout from './components/TestEditLayout';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <App />,
                errorElement: <ErrorPage />,
            },
            {
                path: 'app',
                element: <App />,
            },
            {
                path: 'login',
                element: <LoginFormModal isOpen={true} />,
            },
            {
                path: 'tests/new',
                element: <TestCreateNew />
            },
            {
                path: 'tests/:testId/edit/',
                element: <TestEditLayout />,
                children: [
                    {
                        errorElement: <ErrorPage />,
                        children: [
                            {
                                index: true,
                                // path: EDIT_TEST_SECTIONS.OVERVIEW.value,
                                element: <TestEditForm section={EDIT_TEST_SECTIONS.OVERVIEW.value} />,
                            },
                            {
                                path: EDIT_TEST_SECTIONS.OVERVIEW.value,
                                element: <TestEditForm section={EDIT_TEST_SECTIONS.OVERVIEW.value} />,
                            },
                            {
                                path: EDIT_TEST_SECTIONS.CARD.value,
                                element: <TestEditForm section={EDIT_TEST_SECTIONS.CARD.value} />,
                            },
                            {
                                path: EDIT_TEST_SECTIONS.INSTRUCTIONS.value,
                                element: <TestEditForm section={EDIT_TEST_SECTIONS.INSTRUCTIONS.value} />,
                            },
                            {
                                path: EDIT_TEST_SECTIONS.SCORING.value,
                                element: <TestEditForm section={EDIT_TEST_SECTIONS.SCORING.value} />,
                            },
                            {
                                path: EDIT_TEST_SECTIONS.QUESTIONS.value,
                                element: <TestEditForm section={EDIT_TEST_SECTIONS.QUESTIONS.value} />,
                            },
                            {
                                path: EDIT_TEST_SECTIONS.QUESTIONS_ORDER.value,
                                element: <TestEditForm section={EDIT_TEST_SECTIONS.QUESTIONS_ORDER.value} />,
                            },
                            {
                                path: EDIT_TEST_SECTIONS.IMAGES.value,
                                element: <TestEditForm section={EDIT_TEST_SECTIONS.IMAGES.value} />,
                            },
                        ],
                    },
                ],

            },
            {
                path: '/sessions/:sessionId/',
                element: <Session />,
                loader: sessionLoader,
                children: [
                    // {
                    //     path: '/sessions/:sessionId/:questionNumber',
                    //     element: <Session />,
                    //     loader: sessionLoader,
                    // },

                ],
            },
            {
                path: '/sessions/:sessionId/results',
                element: <SessionResult />,
                loader: sessionResultLoader,
            },
        ],
    },
]);


// console.log(awsconfig)
Amplify.configure(awsconfig);



ReactDOM.render(
    <React.StrictMode>
        <Authenticator.Provider>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </Authenticator.Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorkerRegistration.register();
