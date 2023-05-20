import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Button, Segment, Icon, Container, Header, Divider, Checkbox } from 'semantic-ui-react';


const Editable = ({ DisplayComponent, EditComponent }) => {
    // console.log(props)
    const [editMode, setEditMode] = useState(false);
    // const location = useLocation();
    // console.log(location)
    // const { DisplayComponent, EditComponent } = location.state;

    return (
        <Container>

            <Segment basic style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <Checkbox
                    color='green'
                    toggle
                    label={editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
                    onChange={(e, data) => setEditMode(data.checked)}
                    checked={editMode}
                />
            </Segment>


            <Segment basic>

                {
                    !editMode
                        ? <DisplayComponent />
                        : <EditComponent setEditMode={setEditMode} />
                }

            </Segment>


            {/* <Segment basic style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                {
                    !editMode &&
                    (
                        <Button
                            color='green'
                            floated='right'
                            onClick={() => setEditMode(true)}>
                            <>
                                Edit Test
                                <Icon name='right chevron' />
                            </>
                        </Button>
                    )
                }

            </Segment> */}



        </Container>
    )
}

export default Editable
