import React, { useState, useEffect } from 'react';
import { Icon, Button, Divider, Container, Segment, Header, Pagination } from 'semantic-ui-react';
import PlaceholderComponent from './PlaceholderComponent';
import { useEditTestMutation, useGetFullTestQuery } from '../store/testsSlice';
import QuestionViewer from './QuestionViewer';
import QuestionEditor from './QuestionEditor';
import Swal from 'sweetalert2';
import PlaceholderAddElement from './PlaceholderAddElement';
import { useLocation, useSearchParams } from 'react-router-dom';

const QuestionsViewer = ({ testId, editMode }) => {

  const { data: test, isFetching: isTestFetching, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);
  const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);


  const [searchParams, setSearchParams] = useSearchParams();
  const q = Number(new URLSearchParams(useLocation().search).get('q'));

  const handlePaginationChange = (e, { activePage }) => {
    e.preventDefault();
    setQuestionIndex(activePage - 1);
    setSearchParams({ q: activePage });
  }

  const handleNextClickButton = () => {
    setQuestionIndex(prev => {
      if (prev < questionCount) {
        setSearchParams({ q: prev + 2 })
        return prev + 1;
      } else {
        setSearchParams({ q: prev + 1 })
        return prev;
      }

    });

  }

  const handlePreviousClickButton = () => {
    setQuestionIndex(prev => {
      if (prev > 0) {
        setSearchParams({ q: prev })
        return prev - 1;
      } else {
        setSearchParams({ q: prev + 1 })
        return prev;
      }
    })

  }

  const handleAddQuestion = () => {

    const body = {
      questionCount,
      testId,
      scope: 'questionAdd',
    }

    // console.log(body)

    editTest(body)
      .unwrap()
      .then((fullfilled) => {
        Swal.fire({
          position: 'bottom',
          toast: true,
          icon: 'success',
          title: `Question Added`,
          showConfirmButton: false,
          timer: 3000
        })
      })
      .then((fullfilled) => {
        setQuestionIndex((prev) => {
          setSearchParams({ q: prev + 2 })
          return (prev + 1);
        });

      })
      .catch((err) => console.log(err))

  }

  const handleOnDelete = (e, { questionIndex }) => {
    e.preventDefault();

    const body = {
      questionIndex,
      testId,
      scope: 'questionDelete',
    }

    editTest(body)
      .unwrap()
      .then((fullfilled) => {
        Swal.fire({
          position: 'bottom',
          toast: true,
          icon: 'success',
          title: `Question Deleted`,
          showConfirmButton: false,
          timer: 3000
        })
      })
      .then((fullfilled) => {
        // reduce questionIndex
        setQuestionIndex((prev) => {
          setSearchParams({ q: Math.max(prev - 1, 0) + 1 })
          return Math.max(prev - 1, 0);
        })
      })
      .catch((err) => {
        Swal.fire({
          position: 'bottom',
          toast: true,
          icon: 'error',
          title: `Unable to Delete Question `,
          showConfirmButton: false,
          timer: 3000
        })
        console.log(err)
      })
  }

  useEffect(() => {
    setQuestionCount(test?.questions?.length);

    // if searchParams present and <= questionCount setQuestionIndex to searchParams
    if (q > 0) {
      setQuestionIndex(q - 1);
    } else {
      // if q null, setSearchParams to 1
      setSearchParams({ q: 1 })

    }
  }, [test]);

  // console.log('Questions View:', q)

  let content;
  if (isTestFetching) {
    content = <PlaceholderComponent />;
  } else if (isTestError) {
    content = <Header as={'h1'}>{testError}</Header>;
  } else if (isTestSuccess) {


    // TODO: Add new question (index 0 or the end)

    if (questionIndex < questionCount) {
      content = editMode
        ? <QuestionEditor testId={testId} question={test?.questions?.[questionIndex]} questionCount={questionCount} questionIndex={questionIndex} />
        : <QuestionViewer question={test?.questions?.[questionIndex]} questionCount={questionCount} questionIndex={questionIndex} />
    } else {
      // button to add new question
      <PlaceholderAddElement
        text={'Add Question'}
        buttonText={'Add'}
        onClick={handleAddQuestion} />
    }

  } else {
    //isUninitialized
    content = <PlaceholderComponent />;
  }

  const Navigation = () => {
    // 1. No Questions i.e. questionCount = 0 and questionIndex = 0
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
            <Button icon labelPosition='left' onClick={handlePreviousClickButton} disabled={questionIndex === 0}>
              <Icon name='left arrow' />
              Previous
            </Button>
            <Button icon labelPosition='right' color='black' onClick={handleAddQuestion}>
              Add New Question
              <Icon name='add circle' />
            </Button>
          </Segment>
        </Segment.Group>
      )
      // 2. Existing Questions: else if (questionIndex < questionCount)
    } else if (questionIndex < questionCount - 1) {
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
            <Button icon color={'red'} labelPosition='left' onClick={(e) => handleOnDelete(e, { questionIndex })} style={{ paddingRight: '100px' }}>
              <Icon name='remove circle' />
              Delete
            </Button>
            <Button icon labelPosition='left' onClick={handlePreviousClickButton} disabled={questionIndex === 0}>
              <Icon name='left arrow' />
              Previous
            </Button>
            <Button icon labelPosition='right' onClick={handleNextClickButton} disabled={questionIndex >= questionCount - 1}>
              Next
              <Icon name='right arrow' />
            </Button>
          </Segment>
        </Segment.Group>

      )
      // 3. else if (questionIndex = questionCount - 1)
    } else {
      return (
        <Segment.Group horizontal raised={false} compact>
          <Segment textAlign='left'>
            <Pagination
              activePage={questionIndex + 1}
              onPageChange={handlePaginationChange}
              totalPages={questionCount}
            />

          </Segment>

          <Segment textAlign='right'>
            <Button icon color={'red'} labelPosition='left' onClick={(e) => handleOnDelete(e, { questionIndex })} style={{ paddingRight: '100px' }}>
              <Icon name='remove circle' />
              Delete
            </Button>
            <Button icon labelPosition='left' onClick={handlePreviousClickButton} disabled={questionIndex === 0}>
              <Icon name='left arrow' />
              Previous
            </Button>
            <Button icon labelPosition='right' color='black' onClick={handleAddQuestion}>
              Add New Question
              <Icon name='add circle' />
            </Button>
          </Segment>
        </Segment.Group>
      );

    }
  }

  return (
    <Container>


      <Container>
        <Navigation />
      </Container>


      <Container>
        {content}
      </Container>


    </Container>
  )
}

export default QuestionsViewer;
