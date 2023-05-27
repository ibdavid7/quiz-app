import React, { useRef, useState, useReducer } from 'react';
import { Container, Menu, Segment, Header, Icon, } from 'semantic-ui-react';
import { useLoaderData, useNavigate, Outlet, useLocation } from "react-router-dom";
import TestEditHeader from './TestEditHeader';
import { useGetFullTestQuery } from '../store/testsSlice';
import Overview from './Overview'
import OverviewEditor from './OverviewEditor';
import Editable from './Editable';
import Card from './Card';
import CardEditor from './CardEditor'
import Instructions from './Instructions';
import InstructionsEditor from './InstructionsEditor';
import Scoring from './Scoring';
import ScoringEditor from './ScoringEditor';
import Questions from './Questions';
import ImageGallery from './ImageGallery';
import ImageUploader from './ImageUploader';



export async function loader({ params }) {
    // console.log(params)
    return params;
}

const [OVERVIEW, CARD, INSTRUCTIONS, SCORING, QUESTIONS, IMAGES] = ['overview', 'card', 'instructions', 'scoring', 'questions', 'image gallery'];


const reducer = (state, action) => {
    // console.log(action)

    switch (action.type) {
        case OVERVIEW: {
            // TODO add test data
            const DisplayComponent = (props) => <Overview  {...props} testId={action.payload} />
            const EditComponent = (props) => <  OverviewEditor {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent
            };
        }
        case CARD: {
            const DisplayComponent = (props) => <Card  {...props} testId={action.payload} />
            const EditComponent = (props) => <  CardEditor {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent
            };
        }
        case INSTRUCTIONS: {
            const DisplayComponent = (props) => <Instructions  {...props} testId={action.payload} />
            const EditComponent = (props) => <  InstructionsEditor {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent
            };
        }
        case SCORING: {
            const DisplayComponent = (props) => <Scoring  {...props} testId={action.payload} />
            const EditComponent = (props) => <  ScoringEditor {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent
            };
        }
        case QUESTIONS: {
            const DisplayComponent = (props) => <Questions  {...props} testId={action.payload} />
            const EditComponent = (props) => <Questions {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent
            };
        }
        case IMAGES: {
            const DisplayComponent = (props) => <ImageGallery  {...props} testId={action.payload} />
            const EditComponent = (props) => <ImageUploader {...props} testId={action.payload} />
            return {
                DisplayComponent,
                EditComponent
            };
        }
    }
    throw Error('Unknown action: ' + action.type);

}


const TestEditForm = () => {

    const { testId } = useLoaderData();
    // console.log(testId)
    const location = useLocation()
    // console.log(location)

    const navigate = useNavigate();

    const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: refetchTest } = useGetFullTestQuery(testId);
    // console.log(isTestSuccess)
    // console.log(isTestError)
    // console.log(testError)
    // console.log(test)
    const [editableContent, editableContentDispatch] = useReducer(
        reducer,
        // initialArg
        { type: OVERVIEW, payload: testId },
        // Initilizer Function, gets called with initialArg
        (initialState) => reducer(null, initialState)
    );


    // Handler function for TestEditHeader: controlled element
    const [activeItem, setActiveItem] = useState('overview');

    const handleItemClick = (e, { name }) => {

        switch (name) {
            case OVERVIEW:
                editableContentDispatch(({ type: OVERVIEW, payload: testId }))
                setActiveItem(OVERVIEW);
                break;
            case CARD:
                editableContentDispatch(({ type: CARD, payload: testId }))
                setActiveItem(CARD);
                break;
            case INSTRUCTIONS:
                editableContentDispatch(({ type: INSTRUCTIONS, payload: testId }))
                setActiveItem(INSTRUCTIONS);
                break;
            case SCORING:
                editableContentDispatch(({ type: SCORING, payload: testId }))
                setActiveItem(SCORING);
                break;
            case QUESTIONS:
                editableContentDispatch(({ type: QUESTIONS, payload: testId }))
                setActiveItem(QUESTIONS);
                break;
            case IMAGES:
                editableContentDispatch(({ type: IMAGES, payload: testId }))
                setActiveItem(IMAGES);
                break;
            default:
                console.log(`Error : '${name}' menu item not recognized`)
                return;
        }



    }

    return (
        <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>

            <Header as='h2'>
                <Icon name='settings' />
                <Header.Content>
                    Edit Test
                    <Header.Subheader>Manage your test content and submit for review to publish</Header.Subheader>
                </Header.Content>
            </Header>


            <TestEditHeader activeItem={activeItem} handleItemClick={handleItemClick} />

            {/* <div id='edit-detail'> */}
            {/* <Outlet /> */}
            {/* </div> */}

            <Editable {...editableContent}>

            </Editable>

        </Container>
    );
}

export default TestEditForm
