import React from 'react'
import { Button, Container, Icon, Image, Item, Label, List, Rating } from 'semantic-ui-react'

const paragraph = <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />

const Listing = () => (
    <Container>

        <Item.Group divided>
            <Item>
                <Item.Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' />

                <Item.Content>
                    <Item.Header as='a'>Generalist IQ Test</Item.Header>
                    <Item.Meta>
                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/rachel.png' />
                        <span className='author' style={{ color: 'blue' }}>David Thomas | Economist</span>
                    </Item.Meta>
                    <Item.Description >Beginner Friendly | Allows Multiple Attemps | 60 mins | Not Timed</Item.Description>
                    <Item.Content>
                        <List>
                            <List.Header>Measure your IQ with comprehensive Stanford-Cambridge:</List.Header>
                            <List.Item>
                                <List.Icon name='check' />
                                <List.Content>covering numerical, spacial, verbal, and logical reasoning</List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='check' />
                                <List.Content>50 multiple-choice questions ranging in difficulty</List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Icon name='check' />
                                <List.Content>Feedback and detailed answer explanation</List.Content>
                            </List.Item>
                        </List>

                        <List>
                            <List.Item>
                                <List.Content>
                                    <Rating disabled icon='star' defaultRating={4.6} maxRating={5} />
                                    <span>(306)</span>
                                </List.Content>
                            </List.Item>
                            <List.Item>
                                <List.Content>
                                    <Label size='large' color='green'><Icon name='cart plus' /> $1.99</Label>
                                </List.Content>
                            </List.Item>
                        </List>
                    </Item.Content>
                    <Item.Extra>
                        <Label.Group>
                            <Label tag color='red'>Hot & New</Label>
                            <Label >Updated Mar-2023</Label>
                            <Label >IQ Test</Label>
                            <Label icon='globe'>English</Label>
                        </Label.Group>
                    </Item.Extra>
                </Item.Content>
            </Item>

            <Item>
                <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />

                <Item.Content>
                    <Item.Header as='a'>My Neighbor Totoro</Item.Header>
                    <Item.Meta>
                        <span className='cinema'>IFC Cinema</span>
                    </Item.Meta>
                    <Item.Description>{paragraph}</Item.Description>
                    <Item.Extra>
                        <Button primary floated='right'>
                            Buy tickets
                            <Icon name='right chevron' />
                        </Button>
                        <Label>Limited</Label>
                    </Item.Extra>
                </Item.Content>
            </Item>

            <Item>
                <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' />

                <Item.Content>
                    <Item.Header as='a'>Watchmen</Item.Header>
                    <Item.Meta>
                        <span className='cinema'>IFC</span>
                    </Item.Meta>
                    <Item.Description>{paragraph}</Item.Description>
                    <Item.Extra>
                        <Button primary floated='right'>
                            Buy tickets
                            <Icon name='right chevron' />
                        </Button>
                    </Item.Extra>
                </Item.Content>
            </Item>
        </Item.Group>
    </Container>

)

export default Listing