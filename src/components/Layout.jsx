import { Link, Outlet } from 'react-router-dom';

import React from 'react'
import Header from './Header';

const Layout = () => {
    return (
        <>
            <Header />
            <div id='detail'>
                <Outlet />
            </div>
        </>
    )
}

export default Layout;