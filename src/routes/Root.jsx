import { Link, Outlet } from 'react-router-dom';

import React from 'react'
import Header from '../components/Header';

const Root = () => {
    return (
        <>
            <Header />
            <div id='detail'>
                <Outlet />
            </div>
        </>
    )
}

export default Root;