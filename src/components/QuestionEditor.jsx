import React, { useReducer, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { v4 as uuid } from 'uuid';
import PlaceholderComponent from './PlaceholderComponent'
import { Container, Menu, Sidebar, Form, Loader, Header, Divider, Table, Icon, Image, Button, Progress, Grid, Segment, Label } from 'semantic-ui-react'
import { alphabet, DIFFICULTY, LAYOUTS, QUESTIONS_TYPE } from '../constants'
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice'
import ImageGalleryModal from './ImageGalleryModal';
import { LayoutValue } from '../constants/layouts';
import PlaceholderAddElement from './PlaceholderAddElement';



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
      if (field === 'score') {
        if (isNaN(Number(value))) {
          return state;
        } else {
          return {
            ...state,
            [field]: Math.round((+value)),
          }
        }
      }

      return {
        ...state,
        [field]: value,
      }
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
    case 'appendArray':

      const updatedArr = [...state[field], value];

      return {
        ...state,
        [field]: updatedArr,
      }

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


const QuestionEditor = ({ testId, question, questionCount, questionIndex }) => {


  const { data: test, isFetching: isTestFetching, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalState, setModalState] = useState({ isOpen: false, dispatchProps: {} });

  console.log(state)

  useEffect(() => {

    dispatch({
      type: "initialFetch",
      value: test?.['questions']?.[questionIndex]
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
        const { index, subField } = name;
        const clone = structuredClone(state?.['options']?.[index]);
        clone[subField] = value;


        dispatch({
          type,
          field,
          index,
          value: clone,
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

  const handleOnFormSubmit = (e) => {

    console.log(e)

    const body = {
      question: {
        ...state,
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
          title: `Your edit has been saved`,
          showConfirmButton: false,
          timer: 5000
        })
      })
      .catch((err) => console.log(err))
  }

  const Options = ({ colsPerRow }) => {

    let r = 0, c = 0, l = state?.options?.length + 1;

    const options = [];

    for (r = 0; r < (l + 1) / 2; r++) {
      const cols = [];
      // line.push(<Grid.Row key={r}>)
      for (c = 0; c < colsPerRow && (r * 2 + c) < l; c++) {


        let col;
        if ((r * 2 + c) < l - 1) {
          const index = r * 2 + c;
          const optionId = state?.options?.[index]?.['option_id'];
          col = (
            <Grid.Column width={16 / colsPerRow} key={optionId}>
              <Segment
                id={optionId}
                // onClick={() => handleSelectionOnClick(optionId)}
                className={state?.answer_id === optionId ? 'raised green' : 'basic'}
                style={{ cursor: 'pointer' }}
              >
                {/* <span>{alphabet(index)}. </span> */}
                {/* {question?.options?.[index]?.['option_text'] && question?.options?.[index]?.['option_text']} */}
                {/* {question?.options?.[index]?.['option_image'] && <Image src={question?.options?.[index]?.['option_image']} />} */}

                <span>{alphabet(index)}. </span>

                <Form.Field>
                  <label>Enter Option Text</label>
                  <Form.Input
                    placeholder='Enter Option Text'
                    name={{ type: 'updateArray', field: 'options', index, subField: 'option_text' }}
                    value={state?.['options']?.[index]?.['option_text']}
                    onChange={handleOnChange}
                  />
                </Form.Field>

                {state?.options?.[index]?.['option_image'] && <Image size={'medium'} src={state?.options?.[index]?.['option_image']} />}


                <Divider hidden />
                <Form.Field >
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
                          dispatchProps: { type: 'updateArray', field: 'options', index, value: state?.['options']?.[index] }
                        })
                      },
                    }}
                    label={'Image Url'}
                    placeholder='Image Url'
                    name={{ type: 'updateArray', field: 'options', index }}
                    value={state?.['options']?.[index]?.['option_image']}
                    onChange={handleOnChange}
                    focus
                  />
                </Form.Field>

              </Segment>
            </Grid.Column>
          );
        } else {
          col = (
            <Grid.Column width={16 / colsPerRow} key={'0'}>
              <PlaceholderAddElement text={'Add Option'} buttonText={'Add'} handleClick={addOption} />
            </Grid.Column>

          )
        }



        cols.push(col);
      }

      options.push(
        <Grid.Row key={r}>
          {cols}
        </Grid.Row>
      );
    }

    return (
      <Grid stackable relaxed>
        {options}
      </Grid>
    )
  }

  const addOption = () => {
    dispatch({
      type: 'appendArray',
      field: 'options',
      value: {
        option_id: uuid(),
        option_image: null,
        option_text: null,
      },
    });
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


        <Form onSubmit={handleOnFormSubmit}>

          <Form.Field>
            <label>Question Id (Not Editable)</label>
            <Form.Input
              placeholder='Question Id'
              name='id'
              value={state?.question_id}
              disabled
            />
          </Form.Field>
          <Form.Field>
            <label>Enter Question Label (e.g. numberical, verbal etc.)</label>
            <Form.Input
              placeholder='Enter Question Label'
              name={{ type: 'updateField', field: 'label' }}
              value={state?.label}
              onChange={handleOnChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Select Question Type</label>
            <Form.Select
              placeholder='Select Question Type'
              name={{ type: 'updateField', field: 'type' }}
              options={QUESTIONS_TYPE}
              value={state?.type}
              onChange={handleOnChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Select Question Difficulty</label>
            <Form.Select
              placeholder='Select Question Difficulty'
              name={{ type: 'updateField', field: 'difficulty' }}
              options={DIFFICULTY}
              value={state?.difficulty}
              onChange={handleOnChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Enter Question Point Score</label>
            <Form.Input
              placeholder='Enter Question Point Score'
              name={{ type: 'updateField', field: 'score' }}
              type='number'
              value={state?.score}
              onChange={handleOnChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Select Question Layout</label>
            <Form.Select
              placeholder='Select Question Layout'
              name={{ type: 'updateField', field: 'layout' }}
              options={LAYOUTS}
              value={state?.layout}
              onChange={handleOnChange}
            />
          </Form.Field>

          <Button
            type='submit'
            color='green'
            // floated='right'
            onClick={handleOnFormSubmit}
            disabled={editTestIsLoading}
          >
            <>
              {!editTestIsLoading ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
              Save Metadata Changes
            </>
          </Button>

          {editTestIsError &&
            <Segment><Header as={'h3'}>{JSON.stringify(editTestError)}</Header></Segment>}

        </Form>


        <Divider horizontal>
          <Header as='h4' >
            <Segment.Inline>
              <Icon name='check circle' color='black' />
              Question {questionIndex + 1} / {questionCount} ({Math.max(100, ((questionIndex + 1) / (questionCount) * 100).toFixed(0))}%)
            </Segment.Inline>
          </Header>
        </Divider>

        <Form
          onSubmit={handleOnFormSubmit}
        >

          <Form.Field>
            <label>Enter Question Text</label>
            <Form.Input
              placeholder='Enter Question Text'
              name={{ type: 'updateField', field: 'question_text' }}
              value={state?.question_text}
              onChange={handleOnChange}
            />
          </Form.Field>

          <Container fluid>

            <Grid stackable>
              <Grid.Column width={state?.['layout'] ? LayoutValue[state?.['layout']]['question_col'] : LayoutValue['compact']['question_col']}>
                <Image size={'medium'} src={state?.question_image} />

                <Divider hidden />

                <Form.Field >
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
                </Form.Field>


              </Grid.Column>

              <Grid.Column width={state?.['layout'] ? LayoutValue[state?.['layout']]['answers_col'] : LayoutValue['compact']['answers_col']}>

                {question.difficulty && <Label attached='bottom right'>{question.difficulty}</Label>}

                <Options colsPerRow={state?.['layout'] ? LayoutValue[state?.['layout']]['rows_per_answer_col'] : LayoutValue['compact']['rows_per_answer_col']} />

              </Grid.Column>
            </Grid>

          </Container>


          <Button
            type='submit'
            color='green'
            // floated='right'
            onClick={handleOnFormSubmit}
            disabled={editTestIsLoading}
          >
            <>
              {!editTestIsLoading ? <Icon name='save outline left' /> : <Loader inline active size={'mini'} />}
              Save Question Changes
            </>
          </Button>

          {editTestIsError &&
            <Segment><Header as={'h3'}>{JSON.stringify(editTestError)}</Header></Segment>}
        </Form>



        <Divider horizontal>
          <Header as='h4'>
            <Icon name='clipboard' />
            Answer Content
          </Header>
        </Divider>


        <Container
          style={{ marginTop: '2rem', marginBottom: '2rem' }}
          text
          dangerouslySetInnerHTML={{ __html: question?.answer_text }}
        >
        </Container>
        <Image src={question?.answer_image} fluid />


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
          dispatch={dispatch}
          setModalState={setModalState}
        />}
      {content}
    </>

  )
}

export default QuestionEditor
