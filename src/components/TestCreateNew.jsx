import React, { useState } from 'react'
import { Button, Checkbox, Container, Form } from 'semantic-ui-react'

const TestCreateNew = () => {

    const [test, setTest] = useState({ author: null, category: null, title: null });
    const { author, category, title } = test;
    const handleSubmit = (e, o) => {
        console.log(e)
        console.log(o)
    }

    const handleOnChange = (e, { name, value }) => {
        console.log(name)
        console.log(value)
    }


    return (
        <Container>
            <Form onSubmit={handleSubmit}>

                <Form.Field>
                    <label>Author</label>
                    <Form.Input
                        placeholder='Author Name'
                        name='author'
                        value={author}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Test Category</label>
                    <Form.Field
                        placeholder='Test Category'
                        name='category'
                        value={category}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Test Title</label>
                    <Form.Field
                        placeholder='Test Title'
                        name='title'
                        value={title}
                        onChange={handleOnChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox label='I agree to the Terms and Conditions' />
                </Form.Field>
                <Button type='submit'>Create Test</Button>



            </Form>
        </Container>
    )
}

export default TestCreateNew
