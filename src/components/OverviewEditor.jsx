import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Container, Divider, Icon, Segment, Form, Loader, Header } from 'semantic-ui-react';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';



const OverviewEditor = ({ testId, setEditMode }) => {

    // TODO introduce state aattribute to disable Save button if nothing has yet changed
    const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
    const [editTestTitles, { data: editTestDataTitles, error: editTestErrorTitles, isLoading: editTestIsLoadingTitles, isSuccess: editTestIsSuccessTitles, isError: editTestIsErrorTitles }] = useEditTestMutation();
    const [editTestOverview, { data: editTestDataOverview, error: editTestErrorOverview, isLoading: editTestIsLoadingOverview, isSuccess: editTestIsSuccessOverview, isError: editTestIsErrorOverview }] = useEditTestMutation();



    // const [titles, setTitles] = useState({ title: null, subtitle: null });
    // const { title, subtitle } = titles;

    const { handleSubmit, control, formState: { isDirty } } = useForm({
        values: {
            title: test?.['product_summary']?.['title'],
            subtitle: test?.['product_summary']?.['subtitle'],
        },
        resetOptions: {
            keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
        },
    })

    const onError = (errors, e) => console.log(errors, e);

    // useEffect(() => {
    //     setTitles((prev) => {
    //         return {
    //             ...prev,
    //             title: test?.['product_summary']?.['title'],
    //             subtitle: test?.['product_summary']?.['subtitle'],
    //         }
    //     });
    // }, [test]);

    const editorRef = useRef(null);


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

    // const handleOnChange = (e, { name, value }) => {
    //     setTitles((prev) => {
    //         // console.log(prev)
    //         return {
    //             ...prev,
    //             [name]: value,
    //         }
    //     });
    //     // console.log(name)
    //     // console.log(value)
    // }

    const handleOnFormSubmit = (data) => {

        const body = {
            ...data,
            testId,
            scope: 'titles',
        }
        editTestTitles(body)
        // console.log(body)
    }

    // Not used - async doesn't work
    // const myCustomCoverter = async (url, node, on_save, name) => {

    //     if (node === 'img' && name === 'src') {
    //         // console.log(url, node, on_save, name)
    //         return url;
    //     } else {
    //         return url;
    //     }

    //     const signedUrl = url;
    //     console.log(url, node, on_save, name)
    //     return url;
    // }

    return (
        <Container >

            <Container>
                <Form
                    onSubmit={handleSubmit(handleOnFormSubmit, onError)}
                    loading={isTestLoading}
                >

                    <Form.Field>
                        <label>Title</label>

                        <Controller
                            name={'title'}
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: "Missing Test Title"
                                }
                            }}
                            defaultValue={""}
                            render={({
                                field: { onChange, onBlur, value, ref },
                                fieldState: { invalid, isTouched, isDirty, error },
                            }) => <Form.Input
                                    value={value}
                                    onChange={onChange} // send value to hook form
                                    onBlur={onBlur} // notify when input is touched
                                    inputRef={ref} // wire up the input ref
                                    placeholder={'Please Enter Title'}
                                    error={error ? {
                                        content: error?.message,
                                        pointing: 'above',
                                    } : false}
                                />}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Subtitle</label>

                        <Controller
                            name={'subtitle'}
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: "Missing Test Subtitle"
                                }
                            }}
                            defaultValue={""}
                            render={({
                                field: { onChange, onBlur, value, name, ref },
                                fieldState: { invalid, isTouched, isDirty, error },
                            }) => <Form.Input
                                    value={value}
                                    onChange={onChange} // send value to hook form
                                    onBlur={onBlur} // notify when input is touched
                                    inputRef={ref} // wire up the input ref
                                    placeholder={'Please Enter Title'}
                                    error={error ? {
                                        content: error?.message,
                                        pointing: 'above',
                                    } : false}
                                />}
                        />
                    </Form.Field>

                    <Button
                        type='submit'
                        color='green'
                        disabled={editTestIsLoadingTitles || !isDirty}
                    >
                        <>
                            {!editTestIsLoadingTitles ? <Icon name={'save outline'} /> : <Loader inline active size={'mini'} />}
                            Save Title Changes
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
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    // urlconverter_callback: myCustomCoverter,
                }}
            />

            <Segment basic>

                <Button
                    color='green'
                    onClick={handleOnClickSaveOverview}
                    disabled={editTestIsLoadingOverview}
                >
                    <>
                        {!editTestIsLoadingOverview ? <Icon name='save outline' /> : <Loader inline active size={'mini'} />}
                        Save Test Changes
                    </>
                </Button>

                {editTestIsErrorOverview &&
                    <Segment><Header as={'h3'}>{JSON.stringify(editTestErrorOverview)}</Header></Segment>}


            </Segment>
        </Container >

    );
}

export default OverviewEditor
