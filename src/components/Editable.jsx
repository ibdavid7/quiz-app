import React, { useState } from 'react'
import { Button, Segment } from 'semantic-ui-react';



const Editable = ({ displayComponent, editComponent, }) => {
    const [editMode, setEditMode] = useState(false);


    return (
        <>
            <Segment basic>

                {
                    editMode
                        ? displayComponent
                        : editComponent
                }

            </Segment>

            <Segment basic>
                {
                    editMode
                        ? (
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
                        : (
                            <Button
                                color='green'
                                floated='right'
                                onClick={() => setEditMode(true)}
                            >
                                <>
                                    Edit Test
                                    <Icon name='right chevron' />
                                </>
                            </Button>
                        )

                }


            </Segment>
        </>
    )
}

export default Editable
