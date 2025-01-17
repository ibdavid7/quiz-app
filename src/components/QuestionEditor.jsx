import React, { useState } from 'react';
import PlaceholderComponent from './PlaceholderComponent'
import { Container, Form, Header, Divider, Icon, Image, Grid, Segment, Label } from 'semantic-ui-react'
import { DIFFICULTY, LAYOUTS, QUESTIONS_TYPE } from '../constants'
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice'
import ImageGalleryModal from './ImageGalleryModal';
import { LayoutValue } from '../constants/layouts';
import PlaceholderAddElement from './PlaceholderAddElement';
import { useForm, useFieldArray, FormProvider, Controller, get } from 'react-hook-form';
import HookFormControlledField from './HookFormControlledField';
import HookFormControlledDropdown from './HookFormControlledDropdown';
import ButtonSave from './ButtonSave';
import HookFormControlledImagePicker from './HookFormControlledImagePicker';
import QuestionOptionEditor from './QuestionOptionEditor';
import QuestionAnswerEditor from './QuestionAnswerEditor';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';


const QuestionEditor = ({ testId, question, questionCount, questionIndex }) => {


  // const { data: test, isFetching: isTestFetching, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();

  const methods = useForm({
    // values: test?.['questions']?.[questionIndex],
    defaultValues: structuredClone(question),
    shouldUnregister: true,
  })

  const { handleSubmit, register, reset, getValues, control, watch, setValue, formState: { isDirty, isValid, errors } } = methods;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "options",
  });

  // console.log('Question Editor - Fields:', fields)
  // console.log('question', question)


  const watchImage = watch('question_image');
  const watchDifficulty = watch('difficulty') || '';

  // console.log('formValues:', getValues())
  // console.log('options:', fields)


  const [modalState, setModalState] = useState({ isOpen: false, field: null, dispatchProps: {} });

  const handleOnFormSubmit = (data) => {

    const body = {
      question: {
        ...data,
      },
      questionIndex,
      testId,
      scope: 'questionEdit',
    }

    console.log(body)

    editTest(body)
      .unwrap()
      .then((fullfilled) => {
        Swal.fire({
          position: 'bottom',
          toast: true,
          icon: 'success',
          title: `Update saved`,
          showConfirmButton: false,
          timer: 3000
        })
      })
      .catch((err) => console.log(err))
  }

  const handleOnAddOption = (e) => {
    e.preventDefault();
    console.log('event: ', e)
    append({
      option_id: uuidv4(),
      option_image: '',
      option_text: '',
    });
  }

  const handleOnMoveOption = (e, { from, to }) => {
    e.preventDefault();

    // validate from and to indices
    if (from < 0 || to < 0 || from >= fields.length || to >= fields.length) return;

    move(from, to);

  }

  const handleOnDeleteOption = (e, { index, value }) => {
    e.preventDefault()
    console.log('index:', index)
    console.log('value:', value)
    // console.log('getValue:', getValues('answer_id'))

    if (value.option_id === getValues('answer.answer_id')) {
      setValue('answer.answer_id', '', {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    remove(index)

  }

  const handleOnMarkCorrectOption = (e, { value }) => {
    e.preventDefault()

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

  let content;

  content = (
    <Container>

      <Divider horizontal>
        <Header as='h4'>
          <Icon name='clipboard' />
          Question Metadata
        </Header>
      </Divider>


      <Form
        onSubmit={handleSubmit(handleOnFormSubmit)}
        // loading={isTestFetching}
        widths={'equal'}
      >

        <HookFormControlledField
          name={'question_id'}
          control={control}
          label={'Question Id (Not Editable)'}
          disabled={true}
        />

        <HookFormControlledField
          name={'label'}
          control={control}
          label={'Enter Question Label (e.g. numberical, verbal etc.)'}
        />


        <HookFormControlledDropdown
          name={'type'}
          options={QUESTIONS_TYPE}
          label={'Select Question Type'}
          control={control}
        />


        <HookFormControlledDropdown
          name={'difficulty'}
          options={DIFFICULTY}
          label={'Select Question Difficulty'}
          control={control}
        />

        <HookFormControlledField
          name={'score'}
          control={control}
          label={'Enter Question Point Score'}
          type={'number'}
        />

        <HookFormControlledDropdown
          name={'layout'}
          control={control}
          label={'Select Question Layout'}
          options={LAYOUTS}
        />

        <ButtonSave
          type={'submit'}
          color={'green'}
          isDisabled={editTestIsLoading || !isDirty}
          isLoading={editTestIsLoading}
          label={'Save Metadata Changes'}
          isError={editTestIsError || !isValid}
          error={{ ...editTestError, ...errors }}
        />

      </Form>


      <Divider horizontal>
        <Header as='h4' >
          <Segment.Inline>
            <Icon name='check circle' color='black' />
            Question {questionIndex + 1} / {questionCount} ({Math.max(100, ((questionIndex + 1) / (questionCount) * 100).toFixed(0))}%)
          </Segment.Inline>
        </Header>
      </Divider>


      <FormProvider {...methods}>
        <Form
          onSubmit={handleSubmit(handleOnFormSubmit)}
          widths={'equal'}
        >

          <HookFormControlledField
            name={'question_text'}
            control={control}
            label={'Enter Question Text'}
          />

          <Container
            fluid
          >

            <Grid
              columns={LayoutValue[watch('layout')]?.['grid_cols'] ?? LayoutValue['compact']?.['grid_cols']}
              stackable
            >

              <Grid.Column
                width={LayoutValue[watch('layout')]?.['question_col'] ?? LayoutValue['compact']?.['question_col']}
              >

                <Image size={'large'} src={watchImage} />

                <Divider hidden />
                <Form.Field >
                  <HookFormControlledImagePicker
                    name={'question_image'}
                    setModalState={setModalState}
                    control={control}
                  />
                </Form.Field>
                <Divider hidden />

                <HookFormControlledField
                  label={'Answer ID (Click on Correct Option to Set)'}
                  name={'answer.answer_id'}
                  control={control}
                  disabled={true}
                  required={true}
                />

              </Grid.Column>




              <Grid.Column
                width={LayoutValue[watch('layout')]?.['answers_col'] ?? LayoutValue['compact']?.['answers_col']}
              >

                {watchDifficulty && <Label attached='bottom right'>{watchDifficulty}</Label>}



                <Grid
                  columns={LayoutValue[watch('layout')]?.['cols_per_answer_col'] ?? 2}
                  stackable
                >

                  {fields.map((option, index) => {
                    return (



                      <Grid.Column
                        key={option.id}
                        width={LayoutValue[watch('layout')]?.['answer_subCol'] ?? LayoutValue['compact']?.['answer_subCol']}
                      >
                        <QuestionOptionEditor
                          name={`options.${index}`}
                          index={index}
                          setModalState={setModalState}
                          onDelete={handleOnDeleteOption}
                          onMove={handleOnMoveOption}
                          onMarkCorrect={handleOnMarkCorrectOption}
                          watch={watch}
                          control={control}
                        />
                      </Grid.Column>
                    )
                  })}


                  <Grid.Column
                    width={watch('layout') ? LayoutValue[watch('layout')]['answer_subCol'] : LayoutValue['compact']['answer_subCol']}
                  >



                    <PlaceholderAddElement
                      text={'Add Option'}
                      buttonText={'Add'}
                      onClick={handleOnAddOption} />

                  </Grid.Column>

                </Grid>


              </Grid.Column>
            </Grid>

          </Container>


          <ButtonSave
            type='submit'
            color='green'
            isDisabled={editTestIsLoading || !isDirty}
            isLoading={editTestIsLoading}
            label={'Save Question Changes'}
            isError={!isValid}
            error={{ ...editTestError, ...errors }}
          />

        </Form>
      </FormProvider>



      <Divider horizontal>
        <Header as='h4'>
          <Icon name='clipboard' />
          Answer Explanation
        </Header>
      </Divider>


      <Form
        onSubmit={handleSubmit(handleOnFormSubmit)}
        widths={'equal'}
      >
        <QuestionAnswerEditor
          label={'Answer'}
          name={'answer'}
          setModalState={setModalState}
          control={control}
          watch={watch}
        />

        <Divider hidden />

        <ButtonSave
          type={'submit'}
          color={'green'}
          isDisabled={editTestIsLoading || !isDirty}
          isLoading={editTestIsLoading}
          label={'Save Answer Explanation Changes'}
          isError={editTestIsError || !isValid}
          error={{ ...editTestError, ...errors }}
        />
      </Form>

    </Container>
  );


  return (
    <>
      {modalState?.isOpen &&
        <ImageGalleryModal
          testId={testId}
          modalState={modalState}
          setModalState={setModalState}
          setValue={(field, value) => setValue(field, value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          })}
        />}
      {content}
    </>

  )
}

export default QuestionEditor
