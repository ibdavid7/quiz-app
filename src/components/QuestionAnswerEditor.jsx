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
    control,
    watch
}) => {

    // console.log('watch', watch)
    // const { watch, setValue, control, getValues } = useFormContext();
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
                                        label={'Correct Answer: Option ID (Not-editable)'}
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
                                <Divider hidden />


                                {answerBox}

                            </Card.Description>


                        </Card.Content>

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
                        </Card.Content>
                    </Card>


                </Container>

            )}

        />




    )
}

export default QuestionAnswerEditor
