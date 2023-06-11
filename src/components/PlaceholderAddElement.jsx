import React from 'react'
import {
    Button,
    Divider,
    Grid,
    Header,
    Icon,
    Search,
    Segment,
} from 'semantic-ui-react'

const PlaceholderAddElement = ({ text, buttonText, handleClick }) => {
    return (
        <Segment placeholder>
            <Grid columns={1} stackable textAlign='center'>
                <Grid.Row verticalAlign='middle'>
                    <Grid.Column>
                        <Header icon>
                            <Icon color='grey' name='add circle' size={'massive'} />
                            {text}
                        </Header>
                        <Button
                            basic
                            color='grey'
                            onClick={handleClick}
                        >
                            {buttonText}
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    )
}

export default PlaceholderAddElement
