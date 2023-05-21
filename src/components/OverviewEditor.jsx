import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Button, Container, Divider, Icon, Segment, Form, Loader, Header } from 'semantic-ui-react';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';
import PlaceholderComponent from './PlaceholderComponent';


const OverviewEditor = ({ testId, setEditMode }) => {

    // TODO introduce state aattribute to disable Save button if nothing has yet changed
    const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
    const [editTestTitles, { data: editTestDataTitles, error: editTestErrorTitles, isLoading: editTestIsLoadingTitles, isSuccess: editTestIsSuccessTitles, isError: editTestIsErrorTitles }] = useEditTestMutation();
    const [editTestOverview, { data: editTestDataOverview, error: editTestErrorOverview, isLoading: editTestIsLoadingOverview, isSuccess: editTestIsSuccessOverview, isError: editTestIsErrorOverview }] = useEditTestMutation();


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
    // const log = () => {
    //     if (editorRef.current) {
    //         console.log(editorRef.current.getContent());
    //     }
    // };

    const handleOnClickSaveOverview = () => {

        if (editorRef.current) {
            // console.log(editorRef.current.getContent());
            const body = {
                overview: editorRef.current.getContent(),
                testId,
                scope: 'overview'
            }

            editTestOverview(body);
        }


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

        const body = {
            ...titles,
            testId,
            scope: 'titles',
        }
        editTestTitles(body)
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
                                disabled={editTestIsLoadingTitles}
                            >
                                <>
                                    {!editTestIsLoadingTitles ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
                                    Save Title
                                </>
                            </Button>

                            {editTestIsErrorTitles &&
                                <Segment><Header as={'h3'}>{editTestErrorTitles}</Header></Segment>}

                        </Form>
                    </Container>

                    <Divider />
                    <Editor
                        apiKey={process.env.REACT_APP_TINYMCE_API}
                        onInit={(evt, editor) => editorRef.current = editor}
                        initialValue={test?.['product_summary']?.['overview'] || "<p>Insert overview content.</p>"}
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
                            onClick={handleOnClickSaveOverview}
                            disabled={editTestIsLoadingOverview}
                        >
                            <>
                                {!editTestIsLoadingOverview ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
                                Save Text
                            </>
                        </Button>

                        {editTestIsErrorOverview &&
                            <Segment><Header as={'h3'}>{editTestErrorOverview}</Header></Segment>}


                    </Segment>
                </Container >
            )
            : (<PlaceholderComponent />)

    );
}

export default OverviewEditor
