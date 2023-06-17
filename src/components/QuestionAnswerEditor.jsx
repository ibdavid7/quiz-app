import React, { useState } from 'react'
import { Divider, Image, Segment, Card, Icon, Button, Container, Menu } from 'semantic-ui-react'
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import HookFormControlledField from './HookFormControlledField';
import { alphabet } from '../constants';
import HookFormControlledImagePicker from './HookFormControlledImagePicker';
import MenuCompact from './MenuCompact';
import HookFormControlledTextEditor from './HookFormControlledTextEditor';
import HookFormControlledHtmlEditor from './HookFormControlledHtmlEditor';

const QuestionAnswerEditor = ({
    label,
    name,
    setModalState,
}) => {

    const { watch, setValue, control, getValues } = useFormContext();
    const watchImage = watch(`${name}.answer_image`);

    const items = [
        { name: 'Line', icon: 'comment alternate' },
        { name: 'TextBox', icon: 'paragraph' },
        { name: 'HTML', icon: 'html5' },
    ];

    const [activeItem, setActiveItem] = useState('Line');

    const handleOnClick = (e, { name }) => {
        e.preventDefault();
        setActiveItem(name)
    }

    let answerBox;
    switch (activeItem) {
        case items[0]['name']:
            answerBox = (
                <HookFormControlledField
                    label={'Answer Explanation'}
                    name={`${name}.answer_text`}
                    control={control}
                />
            );
            break;
        case items[1]['name']:
            answerBox = (
                <HookFormControlledTextEditor
                    label={'Answer Explanation'}
                    name={`${name}.answer_text`}
                    control={control}
                />
            );
            break;
        case items[2]['name']:
            answerBox = (
                <HookFormControlledHtmlEditor
                    label={'Answer Explanation'}
                    name={`${name}.answer_text`}
                    control={control}
                />
            );
            break;
        default:
            break;
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
                        // key={value.option_id}
                        style={{ cursor: 'pointer' }}
                    >

                        <Card.Content>
                            {/* <Card.Header>{`Answer Explanation`}</Card.Header> */}
                            {/* <br /> */}
                            <Card.Meta>
                                <Card.Meta>
                                    <HookFormControlledField
                                        label={'Option ID (Not-editable)'}
                                        name={`${name}.answer_id`}
                                        control={control}
                                        disabled={true}
                                    />
                                </Card.Meta>
                            </Card.Meta>
                            <br />

                            <Card.Description>

                                <MenuCompact
                                    onClick={handleOnClick}
                                    activeItem={activeItem}
                                    items={items}
                                />
                                <br />

                                {answerBox}

                            </Card.Description>


                        </Card.Content>
                        <br />


                        {value.answer_image &&
                            <Image
                                wrapped ui={false}
                                size={'large'} src={watchImage}
                            />
                        }

                        <Card.Content extra>
                            <HookFormControlledImagePicker
                                name={`${name}.answer_image`}
                                setModalState={setModalState}
                                control={control}
                            />


                            {/* <div className='ui two divs'>

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
                                        disabled={index >= fields.length - 1}
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
                                        basic={watch('answer_id') !== value.option_id}
                                        size='mini'
                                        color='green'
                                        fluid compact
                                        icon={'check circle'}
                                        content={'Mark As Correct Answer'}
                                        onClick={(e) => handleOnMarkCorrect(e, { value })}
                                    />
                                </div>


                            </div > */}
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

export default QuestionAnswerEditor
