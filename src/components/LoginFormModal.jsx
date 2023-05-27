import { useState } from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import AuthenticatorAmplify from './AuthenticatorAmplify'

const LoginFormModal = ({ isOpen }) => {
    const [open, setOpen] = useState(isOpen)

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size={'tiny'}
            // trigger={<Button>Show Modal</Button>}
        >
            {/* <Modal.Header>Login</Modal.Header> */}
            <Modal.Content>
                <AuthenticatorAmplify />
                {/* <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
                <Modal.Description>
                    <Header>Default Profile Image</Header>
                    <p>
                        We've found the following gravatar image associated with your e-mail
                        address.
                    </p>
                    <p>Is it okay to use this photo?</p>
                </Modal.Description> */}
            </Modal.Content>
            {/* <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                    Nope
                </Button>
                <Button
                    content="Yep, that's me"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => setOpen(false)}
                    positive
                />
            </Modal.Actions> */}
        </Modal>
    )
}

export default LoginFormModal