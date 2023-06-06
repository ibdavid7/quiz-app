import React, { useReducer, useEffect } from 'react'
import { Button, Container, Icon, Image, Item, Label, List, Rating, Loader, Divider, Form, Grid, Input, Segment, Header } from 'semantic-ui-react';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';
import PlaceholderComponent from './PlaceholderComponent';


const initialState = {
};

const reducer = (state, action) => {
  // console.log(action)

  const {
    type,
    field,
    value
  } = action;

  switch (type) {
    case "initialFetch":

      return {
        ...state,
        ...action.value,
      };

    case 'updateField':
      // check case of setting price
      if (field === 'price') {
        if (isNaN(Number(value))) {
          return state;
        } else {
          return {
            ...state,
            [field]: Math.round((+value + Number.EPSILON) * 100) / 100,
          }
        }
      }

      return {
        ...state,
        [field]: value,
      }
      break;
    case 'updateArray':
      const {
        index,
      } = action;

      // console.log(field, value, index)

      const updatedArray = state[field].map((item, idx) => {
        if (idx == index) {
          return value;
        } else {
          return item;
        }
      })

      return {
        ...state,
        [field]: updatedArray,
      }
      break;
    case 'updateMap':
      const {
        submap,
      } = action;

      return {
        ...state,
        [`${field}.${submap}`]: value,
      }
    default:
      return state;
  }
};


const CardEditor = ({ testId }) => {

  const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();


  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {

    dispatch({
      type: "initialFetch",
      value: test?.['product_card']
    });

  }, [test]);


  const handleOnChange = (e, { name, value }) => {
    // console.log(name)
    // console.log(value)

    const { type, field } = name;

    switch (type) {
      case 'updateField':
        dispatch({
          type,
          field,
          value,
        });
        break;
      case 'updateArray':
        const { index } = name;
        dispatch({
          type,
          field,
          index,
          value,
        });
        break;
      case 'updateMap':
        const { submap } = name;
        dispatch({
          type,
          field,
          submap,
          value,
        });
        break;
      default:
        console.error(`Error: Task type ${type} not recognized`);
        throw new Error(`Error: Task type ${type} not recognized`);
    }

  }

  const handleOnFormSubmit = () => {

    const body = {
      ...state,
      testId,
      scope: 'card',
    }
    console.log(body)
    // editTest(body)
  }


  // console.log(state)



  return (
    isTestSuccess
      ? (
        <Container>
          <Form onSubmit={handleOnFormSubmit}>

            <Grid columns={2} divided relaxed verticalAlign={'middle'}>
              <Grid.Column>
                <Grid.Row stretched >
                  <Image size={'medium'} src={state?.['image']} />
                  <Divider hidden />
                  <Form.Field >
                    <Input
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
                    />
                  </Form.Field>
                </Grid.Row>
              </Grid.Column>

              <Grid.Column >
                {/* <Image src='https://react.semantic-ui.com/images/wireframe/media-paragraph.png' /> */}

                <Grid.Row stretched>

                  <Form.Group>

                    <Item.Content >
                      {/* <Item.Header as='a'>{test?.['product_card']?.['header']}</Item.Header> */}

                      <Form.Field>
                        <Input
                          label={'Header'}
                          placeholder={'Enter Header'}
                          name={{ type: 'updateField', field: 'header' }}
                          value={state?.['header']}
                          onChange={handleOnChange}
                          focus
                        />
                      </Form.Field>

                      <Item.Meta>
                        {/* TODO: implement author class */}
                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/rachel.png' />
                        <span className='author' style={{ color: 'blue' }}>David Thomas | Economist</span>
                      </Item.Meta>

                      {/* <Item.Description >{state?.['description']}</Item.Description> */}

                      <Form.Field>
                        <Input
                          label={'Description'}
                          placeholder={'Enter Description'}
                          name={{ type: 'updateField', field: 'description' }}
                          value={state?.['description']}
                          onChange={handleOnChange}
                          focus
                        />
                      </Form.Field>

                      <Item.Content>
                        <List>
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
                        </List>

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
                                <Form.Input
                                  label={{ icon: 'cart plus', color: 'green' }}
                                  placeholder={'Enter Price'}
                                  type='number'
                                  default={Number(1.99)}
                                  name={{ type: 'updateField', field: 'price' }}
                                  value={Number(state?.['price'])}
                                  onChange={handleOnChange}
                                />
                              </Form.Field>

                            </List.Content>
                          </List.Item>
                        </List>
                      </Item.Content>
                      <Item.Extra>

                        <Label.Group>
                          {
                            state['tags'] &&
                            Object.entries(state?.['tags'])
                              .map(([key, val], index) => {
                                if (key === 'sale') {
                                  return (
                                    <Label key={index} tag color='red'>{val}</Label>
                                  );
                                } else {
                                  return (
                                    <Form.Field key={index}>
                                      <Input
                                        label={key}
                                        placeholder={'Tag'}
                                        name={{ type: 'updateMap', submap: key }}
                                        value={val}
                                        onChange={handleOnChange}
                                      />
                                    </Form.Field>
                                  );
                                }
                              })
                          }
                        </Label.Group>
                      </Item.Extra>
                    </Item.Content>
                  </Form.Group>
                </Grid.Row>
              </Grid.Column>
            </Grid>


            <Button
              type='submit'
              color='green'
              // floated='right'
              onClick={handleOnFormSubmit}
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
      : (<PlaceholderComponent />)
  )
}

export default CardEditor
