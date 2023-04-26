import React, { useState } from 'react'
import { Button, Container, Icon, Image, Item, Label, List, Rating } from 'semantic-ui-react'
import Card from '../Card';
import PurchaseModal from '../PurchaseModal'

const paragraph = <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />


const Listing = ({ tests: { ids, entities } }) => {

    const [isModalMounted, setIsModalMounted] = useState(false);
    const [modalContent, setModalContent] = useState({});

    return (
        <Container>
            {/* Purchase Model to execute transaction, managed by isOpenState */}
            {isModalMounted && <PurchaseModal
                open={isModalMounted}
                mountModal={setIsModalMounted}
                test={modalContent}
                setContent={setModalContent}
            />}

            <Item.Group divided>
                {ids.map((testId) => {
                    return (
                        <Card
                            key={testId}
                            test={entities[testId]}
                            modal={{
                                mountModal: setIsModalMounted,
                                setContent: setModalContent
                            }}
                        />
                    )
                })}

            </Item.Group>
        </Container>

    )
}

export default Listing