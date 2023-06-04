import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Button, Segment, Icon, Container, Header, Divider, Checkbox } from 'semantic-ui-react';
import { useEditTestMutation } from '../store/testsSlice';

import { Auth } from 'aws-amplify';

Auth.currentAuthenticatedUser({
  bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
})
  .then((user) => console.log(user))
  .catch((err) => console.log(err));



const Editable = ({ DisplayComponent, EditComponent = null, scope, testId }) => {


    const [editTest, { data: editTestData, error: editTestError, isLoading: editTestIsLoading, isSuccess: editTestIsSuccess, isError: editTestIsError }] = useEditTestMutation();

    // console.log(props)
    const [editMode, setEditMode] = useState(false);
    const [photosPublic, setPhotosPublic] = useState(() => {
        const body = {
            tag: true,
            testId,
            scope: 'tags'
        }

        editTest(body)
        .unwrap()
        .then((fulfilled => {
            console.log((fulfilled));
            return true;
        }))
        .catch((rejected) => {
            console.log(rejected);
            return false;
        })
    });
    // const location = useLocation();
    // console.log(location)
    // const { DisplayComponent, EditComponent } = location.state;

    // console.log(scope)
    let content;

    // Scenario 1: edit questions
    if (scope === 'questions') {

        content = <DisplayComponent editMode={editMode} />

    } else {
        // Scenario 2: edit all else
        content = !editMode
            ? <DisplayComponent />
            : <EditComponent setEditMode={setEditMode} />

    }

    return (
        <Container>

            <Segment.Group horizontal >
                <Segment basic>
                    <Checkbox
                        color='green'
                        toggle
                        label={editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                        onChange={(e, data) => setEditMode(data.checked)}
                        checked={editMode}
                    />
                </Segment>
                <Segment basic>
                    <Checkbox
                        align='right'
                        color='green'
                        toggle
                        label={editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                        onChange={(e, data) => editTest(data.checked)}
                        checked={editMode}
                    />
                </Segment>
            </Segment.Group>



            <Segment basic>

                {content}

            </Segment>

        </Container >
    )
}

export default Editable
