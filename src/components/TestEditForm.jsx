import React, { useRef, useState } from 'react';
import { Container, Menu, Segment, Header, Icon } from 'semantic-ui-react';
import { useLoaderData, useNavigate, Outlet } from "react-router-dom";
import TestEditHeader from './TestEditHeader';
import { useGetTestQuery } from '../store/testsSlice';


export async function loader({ params }) {
    console.log(params)
    return params;
}


const TestEditForm = () => {
    const { testId } = useLoaderData();
    // console.log(testId)

    const navigate = useNavigate();

    const { data: test, isLoading: isTestLoading, isSuccess: isTestSuccess, refetch: refetchTest } = useGetTestQuery(testId);




    // Header: controlled element
    const [activeItem, setActiveItem] = useState('overview');

    const handleItemClick = (e, { name }) => {
        console.log('name:', name)

        const [OVERVIEW, CARD, INSTRUCTIONS, SCORING, QUESTIONS] = ['overview', 'card', 'instructions', 'scoring', 'questions'];

        switch (name) {
            case OVERVIEW:
                navigate(name, { state: { testId, test } });
                setActiveItem(name)
                break;
            case CARD:
                navigate(name, { state: { testId, test } });
                setActiveItem(name)
                break;
            default:
                console.log(`Error : '${name}' menu item not recognized`)
                return;
        }

        // setActiveItem(name)



        // navigate(name, { state: { test: 7, modal: { mountModal: false, setContent: null } } });

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
            <Outlet />
            {/* </div> */}


        </Container>
    );
}

export default TestEditForm
