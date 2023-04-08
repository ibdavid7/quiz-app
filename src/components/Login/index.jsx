import React, { useState } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Auth } from 'aws-amplify';

async function signIn(username, password) {
    try {
        console.log(username)
        const user = await Auth.signIn("ibdavid@gmx.net", "77777777");
        console.log(user)
    } catch (error) {
        console.log('error signing in', error);
    }
}

const LoginForm = () => {

    const [loginForm, setLoginForm] = useState({ email: '', password: '' });

    const handleChange = (e, { name, value }) => setLoginForm({ [name]: e.target.value })

    const handleSubmit = () => {
        const { email, password } = loginForm;

        signIn(email, password);
        // console.log(email);

        setLoginForm({ email: '', password: '' });

        // this.setState({ submittedEmail: email, submittedPassword: password })
    }


    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    <Image src='/logo.png' /> Log-in to your account
                </Header>
                <Form 
                size='large'
                onSubmit={handleSubmit}
                >
                    <Segment stacked>
                        <Form.Input
                            fluid icon='user'
                            iconPosition='left'
                            placeholder='E-mail address'
                            value={loginForm.email}
                            name='email'
                            onChange={handleChange}
                        />
                        <Form.Input
                            fluid
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            type='password'
                            value={loginForm.password}
                            name='password'
                            onChange={handleChange.password}
                        />

                        <Button
                            color='teal'
                            fluid size='large'
                            onClick={() => signIn()}
                        >
                            Login
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    New to us? <a href='#'>Sign Up</a>
                </Message>
            </Grid.Column>
        </Grid>
    )
}

export default LoginForm