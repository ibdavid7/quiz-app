import { Controller } from 'react-hook-form';
import { Form } from 'semantic-ui-react';



const HookFormControlledDropdown = ({ options, label, name, control, disabled = false }) => {
    return (

        <Form.Field>
            <label>{label}</label>

            <Controller
                control={control}
                name={name}
                render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                }) => (
                    <Form.Dropdown
                        value={value}
                        onChange={(e, { value }) => onChange(value)} // send value to hook form
                        onBlur={onBlur} // notify when input is touched
                        inputRef={ref} // wire up the input ref

                        options={options}
                        // name={name}
                        fluid
                        selection
                        icon={'dropdown'}
                        placeholder={`Please Select ${label}`}

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

export default HookFormControlledDropdown;