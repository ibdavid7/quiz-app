import React from 'react'
import { Controller } from 'react-hook-form';
import { Form } from 'semantic-ui-react';

//TODO implement
const HookFormControlledTextEditor = ({
  label,
  name,
  control,
  disabled = false,
  required = false,
  // editorRef,
}) => {
  return (

    <Form.Field>
      <label for={name}>{label}</label>

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
          <Form.TextArea
            id={name}
            value={value}
            onChange={onChange} // send value to hook form
            onBlur={onBlur} // notify when input is touched
            inputRef={ref} // wire up the input ref
            placeholder={label}
            error={error ? {
              content: error?.message,
              pointing: 'above',
            } : false}
            disabled={disabled}
          />
        )}
      />
    </Form.Field>
  );
}

export default HookFormControlledTextEditor
