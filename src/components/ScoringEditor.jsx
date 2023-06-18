import React, { useEffect, useRef, useState, useReducer } from 'react';
import PlaceholderComponent from './PlaceholderComponent'
import { Button, Container, Divider, Icon, Segment, Form, Loader, Header } from 'semantic-ui-react';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';
import { useForm, Controller } from "react-hook-form";
import { SCORING_OPTIONS, SCORING_OPTION_FIELDS } from '../constants/scoringOptions';
import HookFormControlledField from './HookFormControlledField';
import HookFormControlledDropdown from './HookFormControlledDropdown';
import ButtonSave from './ButtonSave';



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

//       if (field === 'type') {
//         return {
//           ...state,
//           [field]: value,
//         }
//       } else {
//         return {
//           ...state,
//           [field]: Math.round(+value),
//         }
//       }

//     // case 'updateArray':
//     //   const {
//     //     index,
//     //   } = action;

//     //   // console.log(field, value, index)

//     //   const updatedArray = state[field].map((item, idx) => {
//     //     if (idx == index) {
//     //       return value;
//     //     } else {
//     //       return item;
//     //     }
//     //   })

//     //   return {
//     //     ...state,
//     //     [field]: updatedArray,
//     //   }
//     //   break;
//     // case 'updateMap':
//     //   const {
//     //     submap,
//     //   } = action;

//     //   return {
//     //     ...state,
//     //     [`${field}.${submap}`]: value,
//     //   }
//     default:
//       return state;
//   }
// };

const ScoringEditor = ({ testId }) => {

  const { data: test, isLoading: isTestLoading, isFetching: isTestFetching, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();

  const { handleSubmit, reset, getValues, control, watch, setValue, formState: { isDirty, errors, isValid } } = useForm({
    values: test?.['config']?.['scoring'],
  })

  const type = watch('type');

  useEffect(() => {
    reset({
      ...test?.['config']?.['scoring'],
      type: type,
    });

  }, [type, reset]);

  const handleOnFormSubmit = (data) => {

    const body = {
      scoring: data,
      testId,
      scope: 'scoring',
    }
    // console.log(body);
    editTest(body)

  }

  // console.log('values:', getValues())


  const content = SCORING_OPTION_FIELDS[type]
    .map(({ key, label }, index) => {

      // console.log(key, label)

      return (
        <HookFormControlledField
          name={key}
          control={control}
          label={label}
          type={'number'}
          required={true}
        />
      );
    });


  return (

    <Container>

      <Form
        onSubmit={handleSubmit(handleOnFormSubmit)}
        loading={isTestFetching}
        widths={'equal'}
      >

        <HookFormControlledDropdown
          options={SCORING_OPTIONS}
          label={'Select Scoring Type'}
          name={'type'}
          control={control}
        />

        {content}

        {/* <HookFormControlledField
          name={'mean'}
          control={control}
          label={'mean'}
          type={'number'}
          required={true}
        /> */}

        <Divider hidden />

        <ButtonSave
          type={'submit'}
          color={'green'}
          isDisabled={editTestIsLoading || !isDirty}
          isLoading={editTestIsLoading}
          label={'Save Scoring Changes'}
          isError={editTestIsError || !isValid}
          error={{ ...editTestError, ...errors }}
        />


      </Form>

    </Container>
  )
}

export default ScoringEditor