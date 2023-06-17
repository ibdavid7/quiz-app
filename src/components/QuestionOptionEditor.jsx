import React from 'react'
import { Divider, Image, Segment, Card, Icon, Button, Container } from 'semantic-ui-react'
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import HookFormControlledField from './HookFormControlledField';
import { alphabet } from '../constants';
import HookFormControlledImagePicker from './HookFormControlledImagePicker';


const QuestionOptionEditor = ({
    // label,
    name,
    index,
    setModalState,
    remove,
    swap,
}) => {

    const { watch, setValue, control, getValues } = useFormContext();
    const watchImage = watch(`${name}.option_image`)
    const watchFields = watch('options')
    // console.log('watchFields', watchFields)

    const { fields, update, append, prepend, move, insert } = useFieldArray({
        control,
        name: 'options',
        // rules: { minLength: 1, maxLength: 4 },
    });

    // console.log('fields check:', fields)
    // console.log('remove check:', remove)
    // console.log('answer:', [...watch('answer.answer_id')])
    // console.log('answer:', watch('answer.answer_id'))
    // console.log('answer:', [...watch('answer.answer_id')].includes(value.option_id))

    const handleOnMove = (e, { from, to }) => {
        e.preventDefault();

        // validate from and to indices
        if (from < 0 || to < 0 || from >= fields.length || to >= fields.length) return;

        swap(from, to);

    }

    const handleOnDelete = (e, { index, value }) => {
        e.preventDefault()

        if (value.option_id === getValues('answer_id')) {
            setValue('answer_id', '', {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        }

        remove(index)

    }

    const handleOnMarkCorrect = (e, { value }) => {
        e.preventDefault()
        // console.log(e)

        if (value.option_id === getValues('answer.answer_id')) {
            setValue('answer.answer_id', '', {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        } else {
            setValue('answer.answer_id', value.option_id, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
        }
    }

    return (

        <Controller
            control={control}
            name={name}
            render={({
                field: { onChange, onBlur, value, ref },
                fieldState: { invalid, isTouched, isDirty, error },
            }) => (

                <Container>
                    <Card
                        fluid
                        key={value.option_id}
                        color={watch('answer.answer_id') === (value.option_id) ? 'green' : ''}
                        // className={watch('answer.answer_id') === (value.option_id) ? 'ui raised green' : 'ui raised'}
                        style={{ cursor: 'pointer' }}
                    // raised
                    >

                        <Card.Content>
                            <Card.Header>{`${alphabet(index)}`}</Card.Header>
                            <br />
                            <Card.Meta>
                                <HookFormControlledField
                                    label={'Option ID (Not-editable)'}
                                    name={`${name}.option_id`}
                                    control={control}
                                    disabled={true}
                                />
                            </Card.Meta>

                            <Card.Description>
                                <HookFormControlledField
                                    label={'Enter Option Text'}
                                    name={`${name}.option_text`}
                                    control={control}
                                />
                            </Card.Description>

                        </Card.Content>

                        {value.option_image &&
                            <Image
                                wrapped ui={false}
                                size={'large'} src={watchImage}
                            />
                        }

                        <Card.Content extra>
                            <HookFormControlledImagePicker
                                name={`${name}.option_image`}
                                setModalState={setModalState}
                                control={control}
                            />


                            <div className='ui two divs'>

                                <div className='ui three buttons'>
                                    <Button
                                        basic
                                        size='small'
                                        color='blue'
                                        fluid
                                        compact
                                        icon={'arrow alternate circle up'}
                                        content={'Up'}
                                        onClick={(e) => handleOnMove(e, { from: index, to: index - 1 })}
                                        disabled={index === 0}
                                    />
                                    <Button
                                        basic
                                        size='small'
                                        color='blue'
                                        fluid
                                        compact
                                        icon={'arrow alternate circle down'}
                                        content={'Down'}
                                        onClick={(e) => handleOnMove(e, { from: index, to: index + 1 })}
                                        disabled={index >= watchFields.length - 1}
                                    />
                                    <Button basic
                                        size='small'
                                        color='red'
                                        fluid
                                        compact
                                        icon={'remove circle'}
                                        content={'Delete'}
                                        onClick={(e) => handleOnDelete(e, { index, value })}
                                    />
                                </div>
                                <div className='ui two buttons'>
                                    <Button
                                        basic={watch('answer.answer_id') !== (value.option_id)}
                                        size='mini'
                                        color='green'
                                        fluid compact
                                        icon={'check circle'}
                                        content={'Mark As Correct Answer'}
                                        onClick={(e) => handleOnMarkCorrect(e, { value })}
                                    />
                                </div>


                            </div >
                        </Card.Content>
                    </Card>


                    {/* 
                    <Segment
                        // secondary
                        // raised
                        key={value.option_id}
                        onClick={() => {
                            if (value.option_id === getValues('answer_id')) {
                                setValue('answer_id', '', {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                    shouldTouch: true,
                                });
                            } else {
                                setValue('answer_id', value.option_id, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                    shouldTouch: true,
                                });
                            }
                        }}
                        className={watch('answer_id') === value.option_id ? 'raised secondary green' : 'raised'}
                        style={{ cursor: 'pointer' }}
                    >

                        <span>{alphabet(index)}. </span>

                        <HookFormControlledField
                            label={'Option ID (Not-editable)'}
                            name={`${name}.option_id`}
                            control={control}
                            disabled={true}
                        />

                        <HookFormControlledField
                            label={'Enter Option Text'}
                            name={`${name}.option_text`}
                            control={control}
                        />

                        {value.option_image && <Image size={'large'} src={watchImage} />}


                        <Divider hidden />

                        <HookFormControlledImagePicker
                            name={`${name}.option_image`}
                            setModalState={setModalState}
                            control={control}
                        />
                    </Segment>
                     */}
                </Container>

            )}

        />




    )
}

export default QuestionOptionEditor
