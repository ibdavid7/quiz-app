import { Menu, Input, Container, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import LoginFormModal from './LoginFormModal';
import { useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

const Home = () => {
    const { user, signOut } = useAuthenticator((context) => [context.user]);

    return (
        <>
            <h2>Welcome, {user.username}!</h2>
            <button onClick={signOut}>Sign Out</button>
        </>
    );
};



const Header = () => {

    const [open, setOpen] = useState(false);
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const { authStatus } = useAuthenticator(context => [context.authStatus]);


    return (
        <Container >

            <Menu secondary >
                <Menu.Item as={Link} to="/">
                    Home
                </Menu.Item>
                <Menu.Item as={Link} to="/about">
                    About
                </Menu.Item>
                <Menu.Item as={Link} to="/contact">
                    Contact
                </Menu.Item>
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <Input icon='search' placeholder='Search...' />
                    </Menu.Item>
                    <Menu.Item as={Link} to="/tests/new">
                        Create Test
                    </Menu.Item >

                    {
                        (authStatus === 'authenticated')
                            ? (
                                <Menu.Item>
                                    <Button
                                        basic
                                        color={'black'}
                                        onClick={() => signOut()}
                                    >
                                        Logout
                                    </Button>
                                </Menu.Item >

                            )
                            : (
                                <Menu.Item>
                                    <Button
                                        basic
                                        color={'blue'}
                                        onClick={() => setOpen(true)}
                                    >
                                        Login
                                    </Button>
                                </Menu.Item >

                            )
                    }


                </Menu.Menu>
            </Menu >

            {open && <LoginFormModal isOpen={open} />}

        </Container>
    )
}

export default Header
