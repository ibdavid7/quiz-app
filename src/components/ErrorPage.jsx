import { useRouteError } from "react-router-dom";

import React from 'react'

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <pre>{`(${error.status} - ${error.statusText}): ${error.error.message}`}</pre>
            </p>
        </div>
    );
}

export default ErrorPage;