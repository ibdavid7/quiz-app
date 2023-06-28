import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useEditTestMutation, useEditTestReorderQuestionsMutation, useGetFullTestQuery } from '../store/testsSlice';
import { Icon, Button, Divider, Container, Segment, Header, Pagination, Card, Image, Grid, List } from 'semantic-ui-react';
import Swal from 'sweetalert2';


const QuestionsDragAndDrop = ({ testId }) => {

    const { data: test, isFetching: isTestFetching, isError: isTestError, error: testError,
        isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);

    const [editQuestionOrder, { data: editQuestionOrderData, error: editQuestionOrderError,
        isLoading: editQuestionOrderIsLoading, isSuccess: editQuestionOrderIsSuccess,
        isError: editQuestionOrderIsError }] = useEditTestReorderQuestionsMutation();

    const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading,
        isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();


    useEffect(() => {
        if (isTestSuccess) {
            setQuestions([...test?.questions]);
        }
    }, [test]);

    const [questions, setQuestions] = useState([]);

    function handleOnDragEnd(result) {
        // if destination outside Droppable context
        if (!result.destination) return;

        // update state
        const items = Array.from(questions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setQuestions(items);

        // optimistic update to back-up, un-do optimistic update if error
        const body = {
            sourceIndex: result.source.index,
            destinationIndex: result.destination.index,
            testId,
            scope: 'questionOrder',
        }

        editQuestionOrder(body)
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
            .catch((err) => {
                Swal.fire({
                    position: 'bottom',
                    toast: true,
                    icon: 'error',
                    title: `Unable to save`,
                    showConfirmButton: false,
                    timer: 3000
                })
                console.log(err)
            })
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

    return (
        <Container textAlign={'left'} >
            <Header as={'h2'} textAlign='center'>
                Drag & Drop to Reorder Questions
            </Header>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="questions">
                    {(provided) => (
                        <ul style={{ listStyleType: 'none' }} className='questions' {...provided.droppableProps} ref={provided.innerRef}>
                            {questions.map(({ question_id, question_text, question_image, score, type, difficulty, }, index) => {
                                return (
                                    <Draggable key={question_id} draggableId={question_id} index={index}>
                                        {(provided) => (
                                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>


                                                <Card
                                                    fluid
                                                    key={question_id}
                                                    color={'grey'}
                                                    style={{ cursor: 'pointer' }}
                                                    raised
                                                >

                                                    <Card.Content>
                                                        <Card.Header>{`Question Number ${index + 1}`}</Card.Header>
                                                        <Card.Meta>
                                                            <span >{`Question ID: ${question_id}`}</span>
                                                        </Card.Meta>



                                                    </Card.Content>

                                                    <Grid>
                                                        <Grid.Column width={3} textAlign={'center'}>
                                                            <Image
                                                                floated='right'
                                                                size='tiny'
                                                                src={question_image}
                                                                rounded
                                                                textAlign={'center'}
                                                            />

                                                        </Grid.Column>
                                                        <Grid.Column width={10} textAlign={'left'}>

                                                            <Card.Description>
                                                                <p>
                                                                    Question: {question_text}
                                                                </p>
                                                                <p>
                                                                    Type: {type}
                                                                </p>
                                                                <p>
                                                                    Score: {score}
                                                                </p>
                                                                <p>
                                                                    Difficulty: {difficulty}
                                                                </p>
                                                            </Card.Description>
                                                        </Grid.Column>
                                                    </Grid>


                                                    <Card.Content extra>

                                                        <div className='ui two buttons'>

                                                            <Button
                                                                basic
                                                                size='small'
                                                                color='red'
                                                                fluid
                                                                icon={'remove circle'}
                                                                content={'Delete Question'}
                                                                onClick={(e) => handleOnDelete(e, { questionIndex: index })}
                                                            />
                                                        </div >
                                                    </Card.Content>
                                                </Card>
                                            </li>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <p>
                Images from <a href="https://final-space.fandom.com/wiki/Final_Space_Wiki">Final Space Wiki</a>
            </p>
        </Container>
    );
}


export default QuestionsDragAndDrop;