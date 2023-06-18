import React, { useState, useEffect } from 'react';
import { Icon, Button, Divider, Container, Segment, Header, Pagination } from 'semantic-ui-react';
import PlaceholderComponent from './PlaceholderComponent';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';
import QuestionViewer from './QuestionViewer';
import QuestionEditor from './QuestionEditor';


const QuestionsViewer = ({ testId, editMode }) => {

  const { data: test, isFetching: isTestFetching, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);


  useEffect(() => {
    setQuestionCount(test?.questions?.length);
  }, [test]);

  let content;
  if (isTestFetching) {
    content = <PlaceholderComponent />;
  } else if (isTestError) {
    content = <Header as={'h1'}>{testError}</Header>;
  } else if (isTestSuccess) {


    // TODO: Add new question (index 0 or the end)
    content = editMode
      ? <QuestionEditor testId={testId} question={test?.questions?.[questionIndex]} questionCount={questionCount} questionIndex={questionIndex} />
      : <QuestionViewer question={test?.questions?.[questionIndex]} questionCount={questionCount} questionIndex={questionIndex} />



  } else {
    //isUninitialized
    content = <PlaceholderComponent />;
  }

  const handlePaginationChange = (e, { activePage }) => {
    e.preventDefault();
    setQuestionIndex(activePage - 1)
  }

  const handleCancelClickButton = () => { }
  const handleCompleteClickButton = () => { }

  const handleNextClickButton = () => {
    setQuestionIndex(prev => {
      if (prev < questionCount) {
        return prev + 1;
      } else {
        return prev;
      }

    });
  }
  const handlePreviousClickButton = () => {
    setQuestionIndex(prev => {
      if (prev > 0) {
        return prev - 1;
      } else {
        return prev;
      }
    })
  }


  const Navigation = () => {
    // 1. No Questions or Last Question
    if (questionIndex >= questionCount) {
      return (
        <Segment.Group horizontal raised={false} compact>
          <Segment basic textAlign='left'>
            <Pagination
              activePage={questionIndex + 1}
              onPageChange={handlePaginationChange}
              totalPages={questionCount}
            />
          </Segment>

          <Segment basic textAlign='right'>
           
            <Button icon labelPosition='right' color='black' onClick={handleNextClickButton}>
              Start
              <Icon name='right arrow' />
            </Button>
            <Button icon labelPosition='right' color='black' onClick={handleCompleteClickButton}>
              Complete
              <Icon name='flag checkered' />
            </Button>
          </Segment>
        </Segment.Group>
      )
      // 2. Existing Questions: else if (questionIndex < questionCount)
    } else {
      return (

        <Segment.Group horizontal raised={false} compact>
          <Segment basic textAlign='left'>
            <Pagination
              activePage={questionIndex + 1}
              onPageChange={handlePaginationChange}
              totalPages={questionCount}
            />
          </Segment>

          <Segment basic textAlign='right'>
            <Button icon labelPosition='left' onClick={handlePreviousClickButton}>
              <Icon name='left arrow' />
              Previous
            </Button>
            <Button icon labelPosition='right' color='black' onClick={handleNextClickButton}>
              Next
              <Icon name='right arrow' />
            </Button>
          </Segment>
        </Segment.Group>

      )
      // 3. Eliminate
    }
  }

  return (
    <Container>


      <Container>
        <Navigation />
      </Container>


      <Container>
        {/* <Divider /> */}

        {content}
      </Container>


    </Container>
  )
}

export default QuestionsViewer;
