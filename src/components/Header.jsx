import { Menu, Input, Container, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import LoginFormModal from './LoginFormModal';
import { useState } from 'react';


const Header = () => {

    const [open, setOpen] = useState(false)

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
                    <Menu.Item
                    // onClick={() => setOpen((prev) => !prev)}
                    // as={Button}
                    // to="/login"
                    >
                        <Button
                            onClick={() => setOpen(true)}
                        >
                            Login
                        </Button>
                    </Menu.Item >
                </Menu.Menu>
            </Menu >

            {open && <LoginFormModal isOpen={open} />}

        </Container>
    )
}

export default Header
