import React from 'react'
import { Container, Input, Form } from 'semantic-ui-react';
import { Controller } from "react-hook-form";


const HookFormControlledImagePicker = ({
    name,
    setModalState,
    control,
    required = false,
}) => {
    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: {
                    value: required,
                    message: "Missing ImageUrl"
                }
            }}
            defaultValue={""}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { invalid, isTouched, isDirty, error },
            }) =>
                <Form.Input
                    action={{
                        color: 'blue',
                        labelPosition: 'left',
                        icon: 'browser',
                        content: 'Browse',
                        onClick: (e) => {
                            e.preventDefault();
                            setModalState({
                                isOpen: true,
                                field: name,
                            })
                        },
                    }}
                    width={16}
                    label={'Image Url'}
                    value={value}
                    onChange={onChange} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={ref} // wire up the input ref
                    placeholder={'Image Url'}
                    error={error ? {
                        content: error?.message,
                        pointing: 'above',
                    } : false}
                    focus
                />
            }
        />
    )
}

export default HookFormControlledImagePicker
