import React from 'react'
import {
    Button,
    Divider,
    Grid,
    Header,
    Icon,
    Search,
    Segment,
    Card
} from 'semantic-ui-react'

const PlaceholderAddElement = ({ text, buttonText, onClick }) => {
    return (
        <Segment placeholder>
            <Grid columns={1} stackable textAlign='center'>
                <Grid.Row verticalAlign='middle'>
                    <Grid.Column>
                        <Header
                            icon
                            onClick={onClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <Icon color='grey' name='add circle' size={'massive'} />
                            {text}
                        </Header>
                        <Button
                            basic
                            color='grey'
                            onClick={onClick}
                            type='button'
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
