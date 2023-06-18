import { Controller } from 'react-hook-form';
import { Form, Dropdown } from 'semantic-ui-react';



const HookFormControlledMultiSelect = ({
    label,
    name,
    control,
    options,
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
                    field: { onChange, onBlur, value, name, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                    formState,
                }) => (
                    <Dropdown
                        value={value}
                        onChange={(e, { value }) => onChange(value)} // send value to hook form
                        onBlur={onBlur} // notify when input is touched
                        inputRef={ref} // wire up the input ref
                        placeholder={label}
                        fluid
                        multiple
                        selection
                        options={options}
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

export default HookFormControlledMultiSelect;