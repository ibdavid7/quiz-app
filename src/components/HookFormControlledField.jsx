import { Controller } from 'react-hook-form';
import { Form } from 'semantic-ui-react';



const HookFormControlledField = ({
    label,
    name,
    control,
    type = 'text',
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
                    <Form.Input
                        value={value}
                        onChange={onChange} // send value to hook form
                        onBlur={onBlur} // notify when input is touched
                        inputRef={ref} // wire up the input ref
                        placeholder={label}
                        type={type}
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
};

export default HookFormControlledField;