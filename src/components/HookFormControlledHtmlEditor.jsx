import React from 'react'
import { Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';
import { Form, Container } from 'semantic-ui-react';

//TODO implement
const HookFormControlledHtmlEditor = ({
    label,
    name,
    control,
    disabled = false,
    required = false,
}) => {
    return (

        <Form.Field>
            <label>{label}</label>

            <Controller
                control={control}
                name={name}
                rules={{
                    required: {
                        value: required,
                        message: `Missing ${name}`
                    }
                }}
                defaultValue={""}
                render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                        <Editor
                            apiKey={process.env.REACT_APP_TINYMCE_API}
                            onInit={(evt, editor) => ref.current = editor}
                            value={value || label}

                            onEditorChange={onChange} // send value to hook form
                            onBlur={onBlur} // notify when input is touched
                            inputRef={ref} // wire up the input ref
                            disabled={disabled}
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
                )}
            />
        </Form.Field>
    );
}

export default HookFormControlledHtmlEditor
