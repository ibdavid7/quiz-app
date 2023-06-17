import React, { useEffect, useState } from 'react';
import PlaceholderComponent from './PlaceholderComponent'
import { Container, Form, Header, Divider, Icon, Image, Grid, Segment, Label } from 'semantic-ui-react'
import { DIFFICULTY, LAYOUTS, QUESTIONS_TYPE } from '../constants'
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice'
import ImageGalleryModal from './ImageGalleryModal';
import { LayoutValue } from '../constants/layouts';
import PlaceholderAddElement from './PlaceholderAddElement';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import HookFormControlledField from './HookFormControlledField';
import HookFormControlledDropdown from './HookFormControlledDropdown';
import ButtonSave from './ButtonSave';
import HookFormControlledImagePicker from './HookFormControlledImagePicker';
import QuestionOptionEditor from './QuestionOptionEditor';
import QuestionAnswerEditor from './QuestionAnswerEditor';


const QuestionEditor = ({ testId, question, questionCount, questionIndex }) => {


  const { data: test, isFetching: isTestFetching, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();

  const methods = useForm({
    values: test?.['questions']?.[questionIndex],
    resetOptions: {
      keepDirtyValues: true, // keep dirty fields unchanged, but update defaultValues
    },
  })

  const { handleSubmit, reset, getValues, control, watch, setValue, formState: { isDirty, isValid, errors } } = methods;

  const { fields, update, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'options',
    rules: { minLength: 1 },
  });

  // persist auto-generated id for useFieldArray item
  useEffect(() => {
    fields.forEach((field, index) => {
      if (!field.option_id) {
        const newId = field.id;
        setValue(`options[${index}].option_id`, newId);
      }
    });
  }, [fields, setValue, remove]);

  const watchImage = watch('question_image');
  const watchDifficulty = watch('difficulty') || '';

  // console.log('formValues:', getValues())
  // console.log('options:', fields)


  const [modalState, setModalState] = useState({ isOpen: false, field: null, dispatchProps: {} });

  const handleOnFormSubmit = (data) => {

    console.log(data)

    // const body = {
    //   question: {
    //     ...state,
    //   },
    //   questionIndex,
    //   testId,
    //   scope: 'questionEdit',
    // }

    // console.log(body)

    // editTest(body)
    //   .unwrap()
    //   .then((fullfilled) => {
    //     Swal.fire({
    //       position: 'bottom',
    //       toast: true,
    //       icon: 'success',
    //       title: `Your edit has been saved`,
    //       showConfirmButton: false,
    //       timer: 5000
    //     })
    //   })
    //   .catch((err) => console.log(err))
  }


  let content;
  if (isTestFetching) {
    content = <PlaceholderComponent />;
  } else if (isTestError) {
    content = <Header as={'h1'}>{testError}</Header>;
  } else if (isTestSuccess) {

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
          loading={isTestFetching}
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
            isError={editTestIsError}
            error={editTestError}
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

            {/* <Form.Field>
            <label>Enter Question Text</label>
            <Form.Input
              placeholder='Enter Question Text'
              name={{ type: 'updateField', field: 'question_text' }}
              value={state?.question_text}
              onChange={handleOnChange}
            />
          </Form.Field> */}

            <Container
              fluid
            >

              <Grid
                columns={LayoutValue[watch('layout')]['grid_cols'] || 2}
                stackable
              >

                {/* <Grid.Column width={LayoutValue[watch('layout')]['question_col'] || LayoutValue['compact']['question_col']}> */}
                <Grid.Column
                  width={watch('layout')
                    ? LayoutValue[watch('layout')]['question_col']
                    : LayoutValue['compact']['question_col']}
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



                  {/* <Form.Field >
                  <Form.Input
                    action={{
                      color: 'blue',
                      labelPosition: 'left',
                      icon: 'browser',
                      content: 'Browse',
                      onClick: (e) => {
                        e.preventDefault();
                        setModalState({
                          isOpen: true,
                          dispatchProps: { type: 'updateField', field: 'question_image' }
                        })
                      },
                    }}
                    label={'Image Url'}
                    placeholder='Image Url'
                    name={{ type: 'updateField', field: 'question_image' }}
                    value={state?.['question_image']}
                    onChange={handleOnChange}
                    focus
                  />
                </Form.Field> */}


                </Grid.Column>

                <Grid.Column
                  width={watch('layout') ? LayoutValue[watch('layout')]['answers_col'] : LayoutValue['compact']['answers_col']}
                >

                  {watchDifficulty && <Label attached='bottom right'>{watchDifficulty}</Label>}

                  <Grid
                    columns={LayoutValue[watch('layout')]['cols_per_answer_col'] || 2}
                    stackable
                  >

                    {fields.map((option, index) => {
                      return (
                        <Grid.Column
                          key={option.id}
                          width={watch('layout') ? LayoutValue[watch('layout')]['answer_subCol'] : LayoutValue['compact']['answer_subCol']}
                        >
                          <QuestionOptionEditor
                            // label={'Enter Option Text'}
                            name={`options.${index}`}
                            index={index}
                            setModalState={setModalState}
                            remove={remove}
                            swap={move}
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
                        onClick={() => append({
                          option_id: '',
                          option_image: '',
                          option_text: '',
                        })} />
                    </Grid.Column>

                  </Grid>


                </Grid.Column>
              </Grid>

            </Container>


            <ButtonSave
              type='submit'
              color='green'
              isDisabled={!isValid}
              isLoading={editTestIsLoading}
              label={'Save Question Changes'}
              isError={!isValid}
              error={errors}
            />

            {/* <Button
              // floated='right'
              // onClick={handleOnFormSubmit}
              disabled={editTestIsLoading}
            >
              <>
                {!editTestIsLoading ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
                Save Question Changes
              </>
            </Button> */}

            {/* {editTestIsError &&
              <Segment><Header as={'h3'}>{JSON.stringify(editTestError)}</Header></Segment>} */}
          </Form>
        </FormProvider>



        <Divider horizontal>
          <Header as='h4'>
            <Icon name='clipboard' />
            Answer Content
          </Header>
        </Divider>


        <FormProvider {...methods}>
          <Form
            onSubmit={handleSubmit(handleOnFormSubmit)}
            widths={'equal'}
          >
            <QuestionAnswerEditor
              label={'Answer'}
              name={'answer'}
              setModalState={setModalState}
            />

            <ButtonSave
              type={'submit'}
              color={'green'}
              isDisabled={editTestIsLoading || !isDirty}
              isLoading={editTestIsLoading}
              label={'Save Answer Explanation Changes'}
              isError={editTestIsError}
              error={editTestError}
            />
          </Form>
        </FormProvider>


      </Container>
    );

  } else {
    //isUninitialized
    content = <PlaceholderComponent />;
  }


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
