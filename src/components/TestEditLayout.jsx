import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom';
import { Container, Menu, Segment, Header, Icon } from 'semantic-ui-react';
import { EDIT_TEST_SECTIONS } from '../constants/editTestSections';

const TestEditLayout = () => {

    // console.log('activeItem:', activeItem)

    return (
        <Container style={{ marginTop: '2rem', marginBottom: '2rem' }}>


            <Header as='h2'>
                <NavLink as={NavLink} to={'.'} >
                    <Icon color={'black'} name='settings' />
                </NavLink>
                <Header.Content>
                    Edit Test
                    <Header.Subheader>Manage your test content and submit for review to publish</Header.Subheader>
                </Header.Content>
            </Header>

            <Container>

                <Menu pointing>

                    {Object.entries(EDIT_TEST_SECTIONS)
                        .map(([key, value]) => {
                            if (value.value !== EDIT_TEST_SECTIONS.SUBMIT.value) {
                                return (
                                    <Menu.Item
                                        as={NavLink}
                                        name={value.text}
                                        to={value.value}
                                        key={key}
                                    />
                                );
                            } else {
                                return (
                                    <Menu.Menu position='right' key={value.key}>
                                        <Menu.Item
                                            as={NavLink}
                                            name={value.text}
                                            to={value.value}
                                            key={value.key}
                                        />
                                    </Menu.Menu>
                                );
                            }
                        })}
                </Menu>
            </Container>

            <Outlet />

        </Container>
    )
}

export default TestEditLayout
