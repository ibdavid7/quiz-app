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
import Root from './routes/Root';
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

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
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
                path: 'tests/:testId/edit',
                element: <TestEditForm />,
                loader: testEditLoader,
                // children: [
                //     {
                //         path: 'overview',
                //         element: <Editable />,
                //     },
                //     {
                //         path: 'card',
                //         element: <Card test modal />,
                //     }
                // ],
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
