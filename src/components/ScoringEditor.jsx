import React, { useEffect, useRef, useState, useReducer } from 'react';
import PlaceholderComponent from './PlaceholderComponent'
import { Button, Container, Divider, Icon, Segment, Form, Loader, Header } from 'semantic-ui-react';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';
import { useForm, Controller } from "react-hook-form";
import { scoringOptions, scoringOptionFields } from '../constants/scoringOptions';



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

  const { handleSubmit, reset, getValues, control, watch, setValue, formState: { isDirty } } = useForm({
    values: test?.['config']?.['scoring'],
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  })


  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {

    dispatch({
      type: "initialFetch",
      value: test?.['config']?.['scoring']
    });

  }, [test]);


  // const triggerFieldValue = watch('type');

  // useEffect(() => {
  //   if (triggerFieldValue) {
  //     // reset(test?.['config']?.['scoring']);
  //     reset();
  //   }
  // },[triggerFieldValue, reset]);

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

  const handleOnFormSubmit = (data) => {

    const body = {
      ...data,
      testId,
      scope: 'scoring',
    }
    // console.log(body);
    editTest(body)
  }

  // const defaultValueDropDown = () => {
  //   const res = scoringOptions.find((item) => item.value === state?.['type'])
  //   console.log(res)
  //   return res;
  // }

  const type = watch('type');
  let content;
  // switch (type) {
  // case 'normal_distribution':
  content = scoringOptionFields[type].map(({key, label}, index) => {
    // console.log(field)

    return (
      <Form.Field key={key}>
        <label>{label}</label>

        <Controller
          name={key}
          control={control}
          rules={{
            required: {
              value: true,
              message: `Missing ${label}`
            }
          }}
          defaultValue={""}
          render={({
            field: { onChange, onBlur, value, ref },
            fieldState: { invalid, isTouched, isDirty, error },
          }) => <Form.Input
              value={value || 0}
              onChange={onChange} // send value to hook form
              onBlur={onBlur} // notify when input is touched
              inputRef={ref} // wire up the input ref
              name={key}
              placeholder={`Please Enter ${label}`}
              type={'number'}
              error={error ? {
                content: error?.message,
                pointing: 'above',
              } : false}
            />}
        />
      </Form.Field>
    );
  })
  // }

  return (
    isTestSuccess
      ? (
        <Container>
          <Form
            loading={isTestLoading}
            onSubmit={handleSubmit(handleOnFormSubmit)}
          >

            <Form.Field>
              <label>Scoring Type</label>



              <Controller
                name={'type'}
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Missing Type"
                  }
                }}
                // defaultValue={""}
                render={({
                  field: { onChange, onBlur, value, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                }) => <Form.Dropdown
                    // defaultValue={value}
                    value={value}
                    onChange={(e, { value }) => onChange(value)} // send value to hook form
                    onBlur={onBlur} // notify when input is touched
                    inputRef={ref} // wire up the input ref
                    options={scoringOptions}
                    name={'type'}
                    fluid
                    selection
                    icon={'dropdown'}
                    placeholder={'Select Scoring Type'}
                    error={error ? {
                      content: error?.message,
                      pointing: 'above',
                    } : false}
                  />
                }
              />


              {/* <Form.Dropdown
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
              /> */}
              {/* {console.log(state?.['type'])} */}

            </Form.Field>


            {
              content
              // Object.keys(state).length &&

              // Object.entries(state)

              //   .map(([key, val], index) => {
              //     if (key !== 'type') {
              //       // console.log(key)
              //       return (
              //         <Form.Field key={index}>
              //           <label>{key}</label>
              //           <Form.Input
              //             placeholder={`Enter ${key}`}
              //             name={{ type: 'updateField', field: key }}
              //             type={'number'}
              //             value={Number(val)}
              //             onChange={handleOnChange}
              //           />
              //         </Form.Field>
              //       )
              //     }
              //   })
            }


            <Button
              type='submit'
              color='green'
              floated='left'
              // onClick={handleOnFormSubmit}
              disabled={editTestIsLoading}
            >
              <>
                {!editTestIsLoading ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
                Save Scoring Changes
              </>
            </Button>

            {editTestIsError &&
              <Segment><Header as={'h3'}>{JSON.stringify(editTestError)}</Header></Segment>}

          </Form>
        </Container>
      )
      : (<PlaceholderComponent />)

  )
}

export default ScoringEditor