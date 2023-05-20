import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Container, Divider, Icon, Segment, Form } from 'semantic-ui-react';
import { useGetEditTestQuery } from '../store/testsSlice';
import PlaceholderComponent from './PlaceholderComponent';

const OverviewEditor = ({ testId, setEditMode }) => {



    // const [editorContent, setEditorContent] = useState('');
    // const [editorState, setEditorState] = useState(EditorState.createEmpty());

    // const handleEditorChange = (content, editor) => {
    //     setEditorContent(content);
    //     console.log(content);
    // };

    // const handleEditorStateChange = (editorState) => {
    //     setEditorState(editorState);
    //     console.log(editorState);
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     console.log(editorContent);
    // };

    // const handleEditorChange = (content, editor) => {
    //     setEditorContent(content);
    //     console.log(content);
    // };

    // const handleEditorStateChange = (editorState) => {
    //     setEditorState(editorState);
    //     console.log(editorState);
    // };

    // const handleSubmit = (e) => {
    //     e.preventDefault();


    const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetEditTestQuery(testId);


    const [titles, setTitles] = useState({ title: null, subtitle: null });
    const { title, subtitle } = titles;


    useEffect(() => {
        setTitles((prev) => {
            return {
                ...prev,
                title: test?.['product_summary']?.['title'],
                subtitle: test?.['product_summary']?.['subtitle'],
            }
        });
    }, [test]);

    const editorRef = useRef(null);
    const log = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
        }
    };

    const handleOnClickSave = () => {
        if (editorRef.current) {
            console.log(editorRef.current.getContent());
            // TODO insert API mutation call to update AWS DynamoDB
        }

        setEditMode(false);

    }

    const handleOnChange = (e, { name, value }) => {
        setTitles((prev) => {
            // console.log(prev)
            return {
                ...prev,
                [name]: value,
            }
        });
        // console.log(name)
        // console.log(value)
    }

    const handleOnFormSubmit = () => {

    }

    return (
        isTestSuccess
            ? (
                <Container >

                    <Container>
                        <Form onSubmit={handleOnFormSubmit}>

                            <Form.Field>
                                <label>Title</label>
                                <Form.Input
                                    placeholder='Enter Title Title'
                                    name='title'
                                    value={title}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Subtitle</label>
                                <Form.Input
                                    placeholder='Enter Test Subtitle'
                                    name='subtitle'
                                    value={subtitle}
                                    onChange={handleOnChange}
                                />
                            </Form.Field>

                            <Button
                                type='submit'
                                color='green'
                                // floated='right'
                                onClick={handleOnFormSubmit}
                            >
                                <>
                                    <Icon name='save outline left' />
                                    Save Title
                                </>
                            </Button>



                        </Form>
                    </Container>

                    <Divider />
                    <Editor
                        apiKey={process.env.REACT_APP_TINYMCE_API}
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue={test['product_summary']['overview'] || "<p>Insert overview content.</p>"}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                    {/* <button onClick={log}>Log editor content</button> */}

                    <Segment basic>

                        <Button
                            color='green'
                            // floated='right'
                            onClick={handleOnClickSave}
                        >
                            <>
                                <Icon name='save outline left' />
                                Save Text
                            </>
                        </Button>

                    </Segment>
                </Container >
            )
            : (<PlaceholderComponent />)

    );
}

export default OverviewEditor
