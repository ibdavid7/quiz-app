import React, { useReducer, useEffect, useState } from 'react'
import { Button, Container, Icon, Image, Item, Label, List, Rating, Loader, Divider, Form, Grid, Input, Segment, Header } from 'semantic-ui-react';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';
import PlaceholderComponent from './PlaceholderComponent';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import ImageGalleryModal from './ImageGalleryModal';


// const initialState = {
// };

// const reducer = (state, action) => {
//   // console.log(action)

//   const {
//     type,
//     field,
//     value
//   } = action;

//   switch (type) {
//     case "initialFetch":

//       return {
//         ...state,
//         ...action.value,
//       };

//     case 'updateField':
//       // check case of setting price
//       if (field === 'price') {
//         if (isNaN(Number(value))) {
//           return state;
//         } else {
//           return {
//             ...state,
//             [field]: Math.round((+value + Number.EPSILON) * 100) / 100,
//           }
//         }
//       }

//       return {
//         ...state,
//         [field]: value,
//       }
//       break;
//     case 'updateArray':
//       const {
//         index,
//       } = action;

//       // console.log(field, value, index)

//       const updatedArray = state[field].map((item, idx) => {
//         if (idx == index) {
//           return value;
//         } else {
//           return item;
//         }
//       })

//       return {
//         ...state,
//         [field]: updatedArray,
//       }
//       break;
//     case 'updateMap':
//       const {
//         submap,
//       } = action;

//       return {
//         ...state,
//         [`${field}.${submap}`]: value,
//       }
//     default:
//       return state;
//   }
// };


const CardEditor = ({ testId }) => {

  const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();
  const [modalState, setModalState] = useState({ isOpen: false, dispatchProps: {} });

  const { handleSubmit, getValues, control, watch, setValue, formState: { isDirty } } = useForm({
    values: test?.['product_card'],
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  })

  const { fields, update } = useFieldArray({
    control,
    // values: test?.['description_bullet_points'],
    name: 'description_bullet_points',
    // rules: { minLength: 1, maxLength: 4 },
  });

  // console.log(fields)
  // console.log(getValues())

  const watchImage = watch("image")


  // const [state, dispatch] = useReducer(reducer, initialState);

  // useEffect(() => {

  //   dispatch({
  //     type: "initialFetch",
  //     value: test?.['product_card']
  //   });

  // }, [test]);


  const handleOnChange = (e, { name, value }) => {
    // console.log(name)
    // console.log(value)

    const { type, field } = name;

    // switch (type) {
    //   case 'updateField':
    //     dispatch({
    //       type,
    //       field,
    //       value,
    //     });
    //     break;
    //   case 'updateArray':
    //     const { index } = name;
    //     dispatch({
    //       type,
    //       field,
    //       index,
    //       value,
    //     });
    //     break;
    //   case 'updateMap':
    //     const { submap } = name;
    //     dispatch({
    //       type,
    //       field,
    //       submap,
    //       value,
    //     });
    //     break;
    //   default:
    //     console.error(`Error: Task type ${type} not recognized`);
    //     throw new Error(`Error: Task type ${type} not recognized`);
    // }

  }

  const handleOnFormSubmit = (data) => {

    const body = {
      ...data,
      testId,
      scope: 'card',
    }
    console.log(body)
    // editTest(body)
  }


  // console.log(state)

  // console.log(watchImage)


  return (
    <Container>

      {modalState?.isOpen &&
        <ImageGalleryModal
          testId={testId}
          modalState={modalState}
          // dispatch={dispatch}
          setModalState={setModalState}
          setValue={(field, value) => setValue(field, value)}
        />}


      <Form
        onSubmit={handleSubmit(handleOnFormSubmit)}
        loading={isTestLoading}
      >

        <Grid columns={2} divided relaxed verticalAlign={'middle'}>
          <Grid.Column>
            <Grid.Row stretched >
              <Image size={'medium'} src={watchImage} />
              <Divider hidden />
              <Form.Field >
                {/* <Input
                      action={{
                        color: 'blue',
                        labelPosition: 'left',
                        icon: 'browser',
                        content: 'Browse',
                      }}
                      label={'Image Url'}
                      placeholder='Image Url'
                      name={{ type: 'updateField', field: 'image' }}
                      value={state?.['image']}
                      onChange={handleOnChange}
                      focus
                    /> */}

                <Controller
                  name={'image'}
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: "Missing ImageUrl"
                    }
                  }}
                  defaultValue={""}
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { invalid, isTouched, isDirty, error },
                  }) =>
                    <Input
                      action={{
                        color: 'blue',
                        labelPosition: 'left',
                        icon: 'browser',
                        content: 'Browse',
                        onClick: (e) => {
                          e.preventDefault();
                          setModalState({
                            isOpen: true,
                            field: 'image',
                            dispatchProps: { type: 'updateField', field: 'image' }
                          })
                        },
                      }}
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


              </Form.Field>
            </Grid.Row>
          </Grid.Column>

          <Grid.Column >
            {/* <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' /> */}

            <Grid.Row stretched>

              <Form.Group widths={16}>
                <Container>

                  {/* <Item.Header as='a'>{test?.['product_card']?.['header']}</Item.Header> */}

                  <Form.Field >
                    {/* <Input
                      style={{ minWidth: '50px' }}
                      label={'Header'}
                      placeholder={'Enter Header'}
                      name={{ type: 'updateField', field: 'header' }}
                      value={state?.['header']}
                      onChange={handleOnChange}
                      focus
                    /> */}

                    <Controller
                      name={'header'}
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: "Missing Header Text"
                        }
                      }}
                      defaultValue={""}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { invalid, isTouched, isDirty, error },
                      }) =>
                        <Input
                          label={'Header'}
                          value={value}
                          onChange={onChange} // send value to hook form
                          onBlur={onBlur} // notify when input is touched
                          inputRef={ref} // wire up the input ref
                          placeholder={'Enter Header Test'}
                          error={error ? {
                            content: error?.message,
                            pointing: 'above',
                          } : false}
                          focus
                        />
                      }
                    />
                  </Form.Field>

                  {/* <Item.Meta> */}
                  {/* TODO: implement author class */}
                  <Image avatar src='https://react.semantic-ui.com/images/avatar/small/rachel.png' />
                  <span className='author' style={{ color: 'blue' }}>David Thomas | Economist</span>
                  {/* </Item.Meta> */}

                  {/* <Item.Description >{state?.['description']}</Item.Description> */}

                  <Form.Field>
                    {/* <Input
                      label={'Description'}
                      placeholder={'Enter Description'}
                      name={{ type: 'updateField', field: 'description' }}
                      value={state?.['description']}
                      onChange={handleOnChange}
                      focus
                    /> */}

                    <Controller
                      name={'description'}
                      control={control}
                      rules={{
                        required: {
                          value: true,
                          message: "Missing Description Text"
                        }
                      }}
                      defaultValue={""}
                      render={({
                        field: { onChange, onBlur, value, ref },
                        fieldState: { invalid, isTouched, isDirty, error },
                      }) =>
                        <Input
                          label={'Description'}
                          value={value}
                          onChange={onChange} // send value to hook form
                          onBlur={onBlur} // notify when input is touched
                          inputRef={ref} // wire up the input ref
                          placeholder={'Enter Description Test'}
                          error={error ? {
                            content: error?.message,
                            pointing: 'above',
                          } : false}
                          focus
                        />
                      }
                    />
                  </Form.Field>

                  {/* <Item.Content> */}

                  <List>
                    {

                      fields.map((field, index) => {

                        if (index === 0) {
                          return (
                            <List.Item key={field.id}>
                              <Form.Field>


                                <Controller
                                  name={`description_bullet_points.${index}.text`}
                                  control={control}
                                  rules={{
                                    required: {
                                      value: true,
                                      message: "Missing Description Text"
                                    }
                                  }}
                                  defaultValue={""}
                                  render={({
                                    field: { onChange, onBlur, value, ref },
                                    fieldState: { invalid, isTouched, isDirty, error },
                                  }) =>
                                    <Input
                                      label={'text'}
                                      value={value}
                                      onChange={onChange} // send value to hook form
                                      onBlur={onBlur} // notify when input is touched
                                      inputRef={ref} // wire up the input ref
                                      placeholder={'Enter Description Test'}
                                      error={error ? {
                                        content: error?.message,
                                        pointing: 'above',
                                      } : false}
                                      focus
                                    />
                                  }
                                />

                                {/* <Input
                                    label={'Text:'}
                                    value={field.text}
                                    placeholder={'Enter Description'}
                                    key={field.id}
                                    control={control}
                                    onChange={(data) => setValue(`description.${index}.text`, data)}
                                    index={index}
                                  /> */}
                              </Form.Field>
                            </List.Item>
                          )
                        } else {

                          return (
                            <List.Item key={field.id}>
                              <Form.Field>

                                <Controller
                                  name={`description_bullet_points.${index}.text`}
                                  control={control}
                                  rules={{
                                    required: {
                                      value: true,
                                      message: "Missing Description Text"
                                    }
                                  }}
                                  defaultValue={""}
                                  render={({
                                    field: { onChange, onBlur, value, ref },
                                    fieldState: { invalid, isTouched, isDirty, error },
                                  }) =>
                                    <Input
                                      label={{ icon: 'check' }}
                                      value={value}
                                      onChange={onChange} // send value to hook form
                                      onBlur={onBlur} // notify when input is touched
                                      inputRef={ref} // wire up the input ref
                                      placeholder={'Enter Description Test'}
                                      error={error ? {
                                        content: error?.message,
                                        pointing: 'above',
                                      } : false}
                                      focus
                                    />
                                  }
                                />

                                {/* <Input
                                    label={{ icon: 'check' }}
                                    value={field.text}
                                    placeholder={'Enter Description'}
                                    key={field.id}
                                    control={control}
                                    onChange={(data) => setValue(`description.${index}.text`, data)}
                                    index={index}
                                  /> */}
                              </Form.Field>
                            </List.Item>
                          )
                        }
                      })

                    }
                  </List>

                  {/* <List>
                      {state?.['description_bullet_points'] &&
                        state?.['description_bullet_points'].map((item, index) => {
                          if (index === 0) {
                            return (
                              <List.Item key={index}>
                                <Form.Field>
                                  <Input
                                    label={'Text:'}
                                    placeholder={'Enter Description'}
                                    name={{ type: 'updateArray', field: 'description_bullet_points', index: index }}
                                    value={item}
                                    onChange={handleOnChange}
                                  />
                                </Form.Field>
                              </List.Item>
                            );
                          } else {
                            return (
                              <Form.Field key={index}>
                                <Input
                                  label={{ icon: 'check' }}
                                  placeholder={'Enter Description'}
                                  name={{ type: 'updateArray', field: 'description_bullet_points', index: index }}
                                  value={item}
                                  onChange={handleOnChange}
                                />
                              </Form.Field>
                            );
                          }
                        })
                      }
                    </List> */}

                  <List>
                    <List.Item>
                      <List.Content>
                        <span
                          style={{ color: 'orange', 'fontWeight': 'bold', 'fontSize': '1.2rem' }}
                        >
                          {(Math.round((Number(test?.['stats']?.['totalScore']) / Number(test?.['stats']?.['ratings'])) * 100) / 100).toFixed(1)}
                        </span>
                        <Rating
                          disabled icon='star'
                          defaultRating={Number(test?.['stats']?.['totalScore']) / Number(test?.['stats']?.['ratings'])} maxRating={5}
                        />
                        <span>
                          ({Number(test?.['stats']?.['ratings'])})
                        </span>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <Form.Field>


                          <Controller
                            name={'price'}
                            control={control}
                            rules={{
                              required: {
                                value: true,
                                message: "Missing Price"
                              }
                            }}
                            defaultValue={""}
                            render={({
                              field: { onChange, onBlur, value, ref },
                              fieldState: { invalid, isTouched, isDirty, error },
                            }) =>
                              <Input
                                label={'Price'}
                                value={value}
                                onChange={onChange} // send value to hook form
                                onBlur={onBlur} // notify when input is touched
                                inputRef={ref} // wire up the input ref
                                placeholder={'Enter Price'}
                                error={error ? {
                                  content: error?.message,
                                  pointing: 'above',
                                } : false}
                                focus
                                type={'number'}
                              />
                            }
                          />


                          {/* <Form.Input
                              label={{ icon: 'cart plus', color: 'green' }}
                              placeholder={'Enter Price'}
                              type='number'
                              default={Number(1.99)}
                              name={{ type: 'updateField', field: 'price' }}
                              value={Number(state?.['price'])}
                              onChange={handleOnChange}
                            /> */}
                        </Form.Field>

                      </List.Content>
                    </List.Item>
                  </List>
                  {/* </Item.Content> */}
                  {/* <Item.Extra> */}

                  {/* <Label.Group> */}
                  <br />
                  {
                    // state['tags'] &&
                    // Object.entries(state?.['tags'])
                    Object.entries(getValues("tags"))

                      .map(([key, val], index) => {
                        if (key === 'sale') {
                          return (
                            <Label key={index} tag color='red'>{val}</Label>
                          );
                        } else {
                          return (
                            <Form.Field key={index}>

                              <Controller
                                name={`tags[${key}]`}
                                control={control}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Missing Tag"
                                  }
                                }}
                                defaultValue={""}
                                render={({
                                  field: { onChange, onBlur, value, ref },
                                  fieldState: { invalid, isTouched, isDirty, error },
                                }) =>
                                  <Input
                                    label={key}
                                    value={value}
                                    onChange={onChange} // send value to hook form
                                    onBlur={onBlur} // notify when input is touched
                                    inputRef={ref} // wire up the input ref
                                    placeholder={'Enter Price'}
                                    error={error ? {
                                      content: error?.message,
                                      pointing: 'above',
                                    } : false}
                                    focus
                                  />
                                }
                              />

                              {/* <Input
                                    label={key}
                                    placeholder={'Tag'}
                                    name={{ type: 'updateMap', submap: key }}
                                    value={val}
                                    onChange={handleOnChange}
                                  /> */}
                            </Form.Field>
                          );
                        }
                      })
                  }
                  {/* </Label.Group> */}
                  {/* </Item.Extra> */}
                </Container>

              </Form.Group>
            </Grid.Row>
          </Grid.Column>
        </Grid>


        <Button
          type='submit'
          color='green'
          // floated='right'
          // onClick={handleOnFormSubmit}
          disabled={editTestIsLoading}
        >
          <>
            {!editTestIsLoading ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
            Save Card Changes
          </>
        </Button>

        {editTestIsError &&
          <Segment><Header as={'h3'}>{JSON.stringify(editTestError)}</Header></Segment>}

      </Form >

    </Container>
  )

}

export default CardEditor
