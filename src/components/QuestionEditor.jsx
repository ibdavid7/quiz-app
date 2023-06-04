import React, { useReducer, useEffect } from 'react'
import PlaceholderComponent from './PlaceholderComponent'
import { Container, Form, Loader, Header, Divider, Table, Icon, Image, Button, Progress, Grid, Segment, Label } from 'semantic-ui-react'
import { alphabet, DIFFICULTY, LAYOUTS, QUESTIONS_TYPE } from '../constants'
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice'


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
      question: {
        ...state,
      },
      questionIndex, 
      testId,
      scope: 'questionEdit',
    }
    console.log(body)
    // editTest(body)
  }


  const Options = ({ colsPerRow }) => {

    let r = 0, c = 0, l = question?.options?.length;

    const options = [];

    for (r = 0; r < (l + 1) / 2; r++) {
      const cols = [];
      // line.push(<Grid.Row key={r}>)
      for (c = 0; c < 2 && (r * 2 + c) < l; c++) {
        const index = r * 2 + c;
        const optionId = question?.options?.[index]?.['option_id'];
        const col = (
          <Grid.Column width={16 / colsPerRow} key={optionId}>
            <Segment
              id={optionId}
              // onClick={() => handleSelectionOnClick(optionId)}
              className={question?.answer_id === optionId ? 'raised green' : 'basic'}
              style={{ cursor: 'pointer' }}
            >
              <span>{alphabet(index)}. </span>
              {question?.options?.[index]?.['option_text'] && question?.options?.[index]?.['option_text']}
              {question?.options?.[index]?.['option_image'] && <Image src={question?.options?.[index]?.['option_image']} />}
            </Segment>
          </Grid.Column>
        );

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
              value={question?.question_id}
              disabled
            />
          </Form.Field>
          <Form.Field>
            <label>Enter Question Label (e.g. numberical, verbal etc.)</label>
            <Form.Input
              placeholder='Enter Question Label'
              name={{ type: 'updateField', field: 'label' }}
              value={question?.label}
              onChange={handleOnChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Select Question Type</label>
            <Form.Select
              placeholder='Select Question Type'
              name={{ type: 'updateField', field: 'type' }}
              options={QUESTIONS_TYPE}
              value={question?.type}
              onChange={handleOnChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Select Question Difficulty</label>
            <Form.Select
              placeholder='Select Question Difficulty'
              name={{ type: 'updateField', field: 'difficulty' }}
              options={DIFFICULTY}
              value={question?.difficulty}
              onChange={handleOnChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Enter Question Point Score</label>
            <Form.Input
              placeholder='Enter Question Point Score'
              name={{ type: 'updateField', field: 'score' }}
              type='number'
              value={question?.score}
              onChange={handleOnChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Select Question Layout</label>
            <Form.Select
              placeholder='Select Question Layout'
              name={{ type: 'updateField', field: 'layout' }}
              options={LAYOUTS}
              value={question?.layout}
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
            <Segment><Header as={'h3'}>{editTestError}</Header></Segment>}

        </Form>

        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={4}>Questions Label</Table.Cell>
              <Table.Cell>{question?.label}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Question Type</Table.Cell>
              <Table.Cell>{question?.type}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Question Difficulty</Table.Cell>
              <Table.Cell>{question?.difficulty}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Question Score</Table.Cell>
              <Table.Cell>{question?.score}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Question Layout</Table.Cell>
              <Table.Cell>{question?.layout}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        <Divider horizontal>
          <Header as='h4' >
            <Segment.Inline>
              <Icon name='check circle' color='black' />
              Question {questionIndex + 1} / {questionCount} ({Math.max(100, ((questionIndex + 1) / (questionCount) * 100).toFixed(0))}%)
            </Segment.Inline>
          </Header>
        </Divider>

        <Header>{question?.question_text}</Header>

        <Container fluid>

          <Grid stackable>
            <Grid.Column width={8}>
              <Image src={question?.question_image} />
            </Grid.Column>
            <Grid.Column width={8}>
              {question.difficulty && <Label attached='bottom right'>{question.difficulty}</Label>}
              <Options colsPerRow={2} />

            </Grid.Column>
          </Grid>
        </Container>


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
    content
    // <Container>
    //   <Divider horizontal>
    //     <Header as='h4'>
    //       <Icon name='clipboard' />
    //       Question Metadata
    //     </Header>
    //   </Divider>



    //   <Table definition>
    //     <Table.Body>
    //       <Table.Row>
    //         <Table.Cell width={4}>Questions Label</Table.Cell>
    //         <Table.Cell>{question?.label}</Table.Cell>
    //       </Table.Row>
    //       <Table.Row>
    //         <Table.Cell>Question Type</Table.Cell>
    //         <Table.Cell>{question?.type}</Table.Cell>
    //       </Table.Row>
    //       <Table.Row>
    //         <Table.Cell>Question Difficulty</Table.Cell>
    //         <Table.Cell>{question?.difficulty}</Table.Cell>
    //       </Table.Row>
    //       <Table.Row>
    //         <Table.Cell>Question Score</Table.Cell>
    //         <Table.Cell>{question?.score}</Table.Cell>
    //       </Table.Row>
    //       <Table.Row>
    //         <Table.Cell>Layout</Table.Cell>
    //         <Table.Cell>{question?.layout}</Table.Cell>
    //       </Table.Row>
    //     </Table.Body>
    //   </Table>

    //   <Divider horizontal>
    //     <Header as='h4' >
    //       <Segment.Inline>
    //         <Icon name='check circle' color='black' />
    //         Question {questionIndex + 1} / {questionCount} ({Math.max(100, ((questionIndex + 1) / (questionCount) * 100).toFixed(0))}%)
    //       </Segment.Inline>
    //     </Header>
    //   </Divider>

    //   <Header>{question?.question_text}</Header>

    //   <Container fluid>

    //     <Grid stackable>
    //       <Grid.Column width={8}>
    //         <Image src={question?.question_image} />
    //       </Grid.Column>
    //       <Grid.Column width={8}>
    //         {question.difficulty && <Label attached='bottom right'>{question.difficulty}</Label>}
    //         <Options colsPerRow={2} />

    //       </Grid.Column>
    //     </Grid>
    //   </Container>


    //   <Divider horizontal>
    //     <Header as='h4'>
    //       <Icon name='clipboard' />
    //       Answer Content
    //     </Header>
    //   </Divider>


    //   <Container
    //     style={{ marginTop: '2rem', marginBottom: '2rem' }}
    //     text
    //     dangerouslySetInnerHTML={{ __html: question?.answer_text }}
    //   >
    //   </Container>
    //   <Image src={question?.answer_image} fluid />


    // </Container>
  )
}

export default QuestionEditor
