import React, { useState } from 'react'
import { Container, Menu, Segment } from 'semantic-ui-react';


const TestEditHeader = ({ activeItem, handleItemClick }) => {

    // console.log('activeItem:', activeItem)

    return (
        <Container>
            <Menu pointing>
                <Menu.Item
                    name='overview'
                    active={activeItem === 'overview'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='card'
                    active={activeItem === 'card'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='instructions'
                    active={activeItem === 'instructions'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='scoring'
                    active={activeItem === 'scoring'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='questions'
                    active={activeItem === 'questions'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='questions order'
                    active={activeItem === 'questions order'}
                    onClick={handleItemClick}
                />
                <Menu.Item
                    name='image gallery'
                    active={activeItem === 'image gallery'}
                    onClick={handleItemClick}
                />
                <Menu.Menu position='right'>
                    <Menu.Item
                        name='submit for review'
                        active={activeItem === 'submit'}
                        onClick={handleItemClick}
                    />
                </Menu.Menu>
            </Menu>

        </Container>
    )
}

export default TestEditHeader
