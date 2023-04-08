import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import {Provider} from "react-redux";
import {store} from "./store/store";

import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
console.log(awsconfig)
Amplify.configure(awsconfig);



ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

serviceWorkerRegistration.register();
