import React, { useRef, useState, useReducer, useEffect } from 'react';
import { Container, Menu, Segment, Header, Icon, } from 'semantic-ui-react';
import { useLoaderData, useNavigate, Outlet, useLocation, useParams, useResolvedPath } from "react-router-dom";
import { useGetFullTestQuery } from '../store/testsSlice';
import Overview from './Overview'
import OverviewEditor from './OverviewEditor';
import Editable from './Editable';
import Card from './Card';
import CardEditor from './CardEditor'
import InstructionsEditor from './InstructionsEditor';
import Scoring from './Scoring';
import ScoringEditor from './ScoringEditor';
import QuestionsViewer from './QuestionsViewer';
import ImageGallery from './ImageGallery';
import ImageUploader from './ImageUploader';
import InstructionsTestDisplay from './InstructionsTestDisplay';
import QuestionsDragAndDrop from './QuestionsDragAndDrop';
import TestEditLayout from './TestEditLayout';
import { EDIT_TEST_SECTIONS } from '../constants/editTestSections';

// Not used
export async function loader({ params, request }) {
    console.log(params)
    // console.log(request)
    return params;
}

// const [OVERVIEW, CARD, INSTRUCTIONS, SCORING, QUESTIONS, QUESTIONS_ORDER, IMAGES] =
//     ['overview', 'card', 'instructions', 'scoring', 'questions', 'questions order', 'image gallery'];


const reducer = (state, action) => {
    // console.log(action)

    switch (action.type) {
        case EDIT_TEST_SECTIONS.OVERVIEW.value: {
            // TODO add test data
            const DisplayComponent = (props) => <Overview  {...props} testId={action.payload} />
            const EditComponent = (props) => <  OverviewEditor {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent,
                scope: action.type,
                testId: action.payload,
            };
        }
        case EDIT_TEST_SECTIONS.CARD.value: {
            const DisplayComponent = (props) => <Card  {...props} testId={action.payload} />
            const EditComponent = (props) => <  CardEditor {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent,
                scope: action.type,
                testId: action.payload,
            };
        }
        case EDIT_TEST_SECTIONS.INSTRUCTIONS.value: {
            const DisplayComponent = (props) => <InstructionsTestDisplay  {...props} testId={action.payload} />
            const EditComponent = (props) => <  InstructionsEditor {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent,
                scope: action.type,
                testId: action.payload,
            };
        }
        case EDIT_TEST_SECTIONS.SCORING.value: {
            const DisplayComponent = (props) => <Scoring  {...props} testId={action.payload} />
            const EditComponent = (props) => <  ScoringEditor {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent,
                scope: action.type,
                testId: action.payload,
            };
        }
        case EDIT_TEST_SECTIONS.QUESTIONS.value: {
            const DisplayComponent = (props) => <QuestionsViewer  {...props} testId={action.payload} />
            return {
                DisplayComponent,
                scope: action.type,
                testId: action.payload,
            };
        }
        case EDIT_TEST_SECTIONS.QUESTIONS_ORDER.value: {
            const DisplayComponent = (props) => <QuestionsDragAndDrop  {...props} testId={action.payload} />
            return {
                DisplayComponent,
                scope: action.type,
                testId: action.payload,
            };
        }
        case EDIT_TEST_SECTIONS.IMAGES.value: {
            const DisplayComponent = (props) => <ImageGallery  {...props} testId={action.payload} />
            const EditComponent = (props) => <ImageUploader {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent,
                scope: action.type,
                testId: action.payload,
            };
        }
    }
    throw Error('Unknown action: ' + action.type);

}


const TestEditForm = ({ section }) => {
    const { testId } = useParams();
    
    // const { testId } = useLoaderData();
    // console.log(section)
    // const location = useLocation()
    // console.log(location)
    // console.log(testId)
    // const location = useLocation()
    // console.log(location)

    // const navigate = useNavigate();

    // const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: refetchTest } = useGetFullTestQuery(testId);
    // console.log(isTestSuccess)
    // console.log(isTestError)
    // console.log(testError)
    // console.log(test)
    const [editableContent, editableContentDispatch] = useReducer(
        reducer,
        // initialArg
        { type: section, payload: testId },
        // Initilizer Function, gets called with initialArg
        (initialState) => reducer(null, initialState)
    );


    // Handler function for TestEditHeader: controlled element
    // const [activeItem, setActiveItem] = useState(section);
    // console.log('activeItem', section)

    const handleItemClick = (e, { name }) => {

        switch (name) {
            case EDIT_TEST_SECTIONS.OVERVIEW.value:
                editableContentDispatch(({ type: EDIT_TEST_SECTIONS.OVERVIEW.value, payload: testId }))
                // setActiveItem(EDIT_TEST_SECTIONS.OVERVIEW.value);
                break;
            case EDIT_TEST_SECTIONS.CARD.value:
                editableContentDispatch(({ type: EDIT_TEST_SECTIONS.CARD.value, payload: testId }))
                // setActiveItem(EDIT_TEST_SECTIONS.CARD.value);
                break;
            case EDIT_TEST_SECTIONS.INSTRUCTIONS.value:
                editableContentDispatch(({ type: EDIT_TEST_SECTIONS.INSTRUCTIONS.value, payload: testId }))
                // setActiveItem(EDIT_TEST_SECTIONS.INSTRUCTIONS.value);
                break;
            case EDIT_TEST_SECTIONS.SCORING.value:
                editableContentDispatch(({ type: EDIT_TEST_SECTIONS.SCORING.value, payload: testId }))
                // setActiveItem(EDIT_TEST_SECTIONS.SCORING.value);
                break;
            case EDIT_TEST_SECTIONS.QUESTIONS.value:
                editableContentDispatch(({ type: EDIT_TEST_SECTIONS.QUESTIONS.value, payload: testId }))
                // setActiveItem(EDIT_TEST_SECTIONS.QUESTIONS.value);
                break;
            case EDIT_TEST_SECTIONS.QUESTIONS_ORDER.value:
                editableContentDispatch(({ type: EDIT_TEST_SECTIONS.QUESTIONS_ORDER.value, payload: testId }))
                // setActiveItem(EDIT_TEST_SECTIONS.QUESTIONS_ORDER.value);
                break;
            case EDIT_TEST_SECTIONS.IMAGES.value:
                editableContentDispatch(({ type: EDIT_TEST_SECTIONS.IMAGES.value, payload: testId }))
                // setActiveItem(EDIT_TEST_SECTIONS.IMAGES.value);
                break;
            default:
                console.log(`Error : '${name}' menu item not recognized`)
                return;
        }

    }
    useEffect(() => {
        handleItemClick(null, { name: section })
    }, [section]);

    // console.log(editableContent)

    return (
        <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>

            {/* <Header as='h2'>
                <Icon name='settings' />
                <Header.Content>
                Edit Test
                    <Header.Subheader>Manage your test content and submit for review to publish</Header.Subheader>
                    </Header.Content>
            </Header>


            <TestEditLayout activeItem={activeItem} handleItemClick={handleItemClick} /> */}

            <Editable {...editableContent}>

            </Editable>

        </Container>
    );
}

export default TestEditForm
