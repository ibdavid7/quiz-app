import React from 'react'
import { Button, Container, Icon, Image, Item, Label, List, Rating, Loader, Divider } from 'semantic-ui-react';
import { redirect, useNavigate, useLocation } from "react-router-dom";
import { useGetFullTestQuery } from '../store/testsSlice';

// TODO refactor into Card.jsx file

const defaultModal = {
    mountModal: false,
    setContent: null,
}

const Card = ({ testId }) => {

    const { data: test, isLoading: isTestLoading, isError: isTestError, error: testError, isSuccess: isTestSuccess, refetch: testRefetch } = useGetFullTestQuery(testId);

    // const isPurchased = test?.isPurchased || false;
    // const { mountModal, setContent } = modal;
    // const navigate = useNavigate();

    // const [createSession, { data: createSessionResponse, isSuccess: createSessionIsSuccess, isError: createSessionIsError, error: createSessionError, isLoading: createSessionIsLoading }] = useCreateSessionMutation();


    // const handlePurchase = () => {
    //     mountModal(true);
    //     setContent(test);
    // }

    // const handleTakeTest = () => {
    //     createSession({
    //         testId: test.id,
    //     }).unwrap()
    //         .then(session => {
    //             // console.log(session)
    //             navigate(`/sessions/${session.sessionId}`);
    //         }).catch(rejected => console.log(rejected));

    // }

    return (
        <Container>
            <Item.Group divided>
                <Item>
                    <Item.Image size='medium' src={test?.['product_card']?.['image']} />

                    <Item.Content>
                        <Item.Header as='a'>{test?.['product_card']?.['header']}</Item.Header>
                        <Item.Meta>
                            {/* TODO: implement author class */}
                            <Image avatar src='https://react.semantic-ui.com/images/avatar/small/rachel.png' />
                            <span className='author' style={{ color: 'blue' }}>David Thomas | Economist</span>
                        </Item.Meta>
                        <Item.Description >{test?.['product_card']?.['description']}</Item.Description>
                        <Item.Content>
                            <List>
                                {test?.['product_card']?.['description_bullet_points']
                                    .map((item, index) => {
                                        if (index === 0) {
                                            return (
                                                <List.Header key={index}>{item}</List.Header>
                                            );
                                        } else {
                                            return (
                                                <List.Item key={index}>
                                                    <List.Icon name='check' />
                                                    <List.Content>{item}</List.Content>
                                                </List.Item>
                                            );
                                        }
                                    })
                                }
                            </List>

                            <List>
                                <List.Item>
                                    <List.Content>
                                        <span
                                            style={{ color: 'orange', 'fontWeight': 'bold', 'fontSize': '1.2rem' }}
                                        >
                                            {(Math.round((Number(test?.['stats']?.['totalScore']) / Number(test?.['stats']?.['ratings'])) * 100) / 100).toFixed(1)}
                                        </span>
                                        <Rating
                                            disabled icon='star'
                                            defaultRating={Number(test?.['stats']?.['totalScore']) / Number(test?.['stats']?.['ratings'])} maxRating={5}
                                        />
                                        <span>
                                            ({Number(test?.['stats']?.['ratings'])})
                                        </span>
                                    </List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content>
                                        <Label size='large' color='green'>
                                            <>
                                                <Icon name='cart plus' />
                                                {Number(test?.['product_card']?.['price'])}
                                            </>
                                        </Label>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Item.Content>
                        <Item.Extra>

                            {/* {isPurchased
                        ? <Button
                            color='green'
                            floated='right'
                            onClick={handleTakeTest}
                        >
                            {createSessionIsLoading
                                ? <>
                                    <Loader active inline='left' size='tiny' inverted /> Loading
                                </>
                                : <>
                                    Take Test
                                    <Icon name='right chevron' />
                                </>}
                            <>
                            </>
                        </Button>
                        : <Button
                            primary
                            floated='right'
                            onClick={handlePurchase}
                        >
                            <>
                                Buy Test
                                <Icon name='right chevron' />
                            </>
                        </Button>
                    } */}


                            <Label.Group>
                                {
                                    test?.['tags']?.['product_card'] &&
                                    Object.entries(test?.['product_card']?.['tags'])
                                        .map(([key, val], index) => {
                                            if (key === 'sale') {
                                                return (
                                                    <Label key={index} tag color='red'>{val}</Label>
                                                );
                                            } else if (key === 'language') {
                                                return (
                                                    <Label key={index}><Icon name='globe' />{val}</Label>
                                                );
                                            } else {
                                                return (
                                                    <Label key={index}>{val}</Label>
                                                );
                                            }
                                        })

                                }
                            </Label.Group>
                        </Item.Extra>
                    </Item.Content>
                </Item>

            </Item.Group>
        </Container>
    )
}

export default Card
