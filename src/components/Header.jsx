import { Menu, Input, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Header = () => {
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
                    <Menu.Item as={Link} to="/login">
                        Login
                    </Menu.Item >
                </Menu.Menu>
            </Menu >
        </Container>
    )
}

export default Header
