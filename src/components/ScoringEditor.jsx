import React, { useEffect, useRef, useState, useReducer } from 'react';
import PlaceholderComponent from './PlaceholderComponent'
import { Button, Container, Divider, Icon, Segment, Form, Loader, Header } from 'semantic-ui-react';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';


const scoringOptions = [
  {
    key: '0',
    text: 'Normal Distribution',
    value: 'normal_distribution',
  },
  {
    key: '1',
    text: 'Pass/Fail',
    value: 'pass_fail',
  },
];

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

      if (field === 'type') {
        return {
          ...state,
          [field]: value,
        }
      } else {
        return {
          ...state,
          [field]: Math.round(+value),
        }
      }

    // case 'updateArray':
    //   const {
    //     index,
    //   } = action;

    //   // console.log(field, value, index)

    //   const updatedArray = state[field].map((item, idx) => {
    //     if (idx == index) {
    //       return value;
    //     } else {
    //       return item;
    //     }
    //   })

    //   return {
    //     ...state,
    //     [field]: updatedArray,
    //   }
    //   break;
    // case 'updateMap':
    //   const {
    //     submap,
    //   } = action;

    //   return {
    //     ...state,
    //     [`${field}.${submap}`]: value,
    //   }
    default:
      return state;
  }
};

const ScoringEditor = ({ testId }) => {

  const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();


  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {

    dispatch({
      type: "initialFetch",
      value: test?.['config']?.['scoring']
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
      // case 'updateArray':
      //   const { index } = name;
      //   dispatch({
      //     type,
      //     field,
      //     index,
      //     value,
      //   });
      //   break;
      // case 'updateMap':
      //   const { submap } = name;
      //   dispatch({
      //     type,
      //     field,
      //     submap,
      //     value,
      //   });
      //   break;
      default:
        console.error(`Error: Task type ${type} not recognized`);
        throw new Error(`Error: Task type ${type} not recognized`);
    }
  }

  const handleOnFormSubmit = () => {

    const body = {
      ...state,
      testId,
      scope: 'scoring',
    }
    editTest(body)
  }

  const defaultValueDropDown = () => {
    const res = scoringOptions.find((item) => item.value === state?.['type'])
    console.log(res)
    return res;
  }

  return (
    isTestSuccess
      ? (
        <Container>
          <Form onSubmit={handleOnFormSubmit}>

            {/* <Form.Field> */}
            <label>Scoring Type</label>

            <Form.Dropdown
              placeholder='Select Scoring Type'
              fluid
              selection
              icon={'dropdown'}
              // defaultValue={defaultValueDropDown()}
              // defaultUpward={true}
              value={state?.['type']}
              onChange={handleOnChange}
              options={scoringOptions}
              name={{ type: 'updateField', field: 'type' }}
            />
            {/* {console.log(state?.['type'])} */}

            {/* </Form.Field> */}


            {
              Object.keys(state).length &&

              Object.entries(state)
                .map(([key, val], index) => {
                  if (key !== 'type') {
                    // console.log(key)
                    return (
                      <Form.Field key={index}>
                        <label>{key}</label>
                        <Form.Input
                          placeholder={`Enter ${key}`}
                          name={{ type: 'updateField', field: key }}
                          type={'number'}
                          value={Number(val)}
                          onChange={handleOnChange}
                        />
                      </Form.Field>
                    )
                  }
                })
            }


            <Button
              type='submit'
              color='green'
              floated='left'
              onClick={handleOnFormSubmit}
              disabled={editTestIsLoading}
            >
              <>
                {!editTestIsLoading ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
                Save Scoring Changes
              </>
            </Button>

            {editTestIsError &&
              <Segment><Header as={'h3'}>{editTestError}</Header></Segment>}

          </Form>
        </Container>
      )
      : (<PlaceholderComponent />)

  )
}

export default ScoringEditor