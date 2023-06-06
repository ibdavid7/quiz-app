import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Container, Menu, Modal, Card, Button, Icon } from 'semantic-ui-react'
import { Amplify, Auth, Storage } from 'aws-amplify';
import { Grid, Image } from 'semantic-ui-react'
import PlaceholderComponent from './PlaceholderComponent'
import ImageCardSimple from './ImageCardSimple';
import { isFulfilled } from '@reduxjs/toolkit';

const bucket = "quizlet-app";



// TODO: create SORT and FILTER functionality
const ImageGalleryModal = ({ testId, dispatch, modalState, setModalState }) => {

    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState('')

    const PAGE_SIZE = 50;
    let nextToken = undefined;
    let hasNextPage = true;

    useEffect(() => {
        const fetchData = async () => {

            if (hasNextPage) {
                let response = await Storage.list('', {
                    level: 'private',
                    pageSize: PAGE_SIZE,
                    nextToken: nextToken,
                });
                if (response.hasNextToken) {
                    nextToken = response.nextToken;
                } else {
                    nextToken = undefined;
                    hasNextPage = false;
                }
                // render list items from response.results
                // console.log(response)
                setImages(response.results);

            }

        };

        fetchData();
    }, []);


    const handleOnSubmit = async () => {
        const { identityId } = await Auth.currentUserCredentials();
        const url = `https://${bucket}.s3.amazonaws.com/private/${identityId}/${selectedImage}`;

        console.log({
            ...modalState.dispatchProps,
            value: url,
        })


        dispatch({
            ...modalState.dispatchProps,
            value: url,
        })

        setModalState({
            isOpen: false,
            dispatchProps: {},
        })
    }

    const copyUrl = async (image) => {
        const { identityId } = await Auth.currentUserCredentials();
        const url = `https://${bucket}.s3.amazonaws.com/private/${identityId}/${image.key}`;

        navigator.clipboard.writeText(url)
            .then(() => {
                Swal.fire({
                    position: 'bottom',
                    toast: true,
                    icon: 'success',
                    title: `Url Copied to Clipboard!`,
                    showConfirmButton: false,
                    timer: 2000
                })
            })
    }

    const selectImage = (image) => {

        if (image.key === selectedImage) {
            // unselect image
            setSelectedImage((prev) => '');
        } else {
            setSelectedImage(image.key);
            Swal.fire({
                position: 'bottom',
                toast: true,
                icon: 'success',
                title: `Image Selected!`,
                showConfirmButton: false,
                timer: 2000
            })
        }


    }


    const content = images.map((image) => {
        // console.log(image.key)
        return (
            <Grid.Column key={image.key}>
                {/* <ImageCard eTag={image.eTag} key={image.key} lastModified={image.lastModified}/> */}
                <ImageCardSimple
                    image={image}
                    selectedImage={selectedImage}
                    copyUrl={copyUrl}
                    selectImage={selectImage}
                />
            </Grid.Column>
        );
    })

    return (

        <Modal
            centered={false}
            open={modalState.isOpen}
            onClose={() => setModalState({ isOpen: false, dispatchProps: {} })}
            // onOpen={() => setOpen({ isOpen: true, dispatchProps: {} })}
            style={{ minWidth: '80%' }}
        // trigger={<Button>Scrolling Content Modal</Button>}
        >

            <Modal.Content
                image
                scrolling
            >
                <Grid columns={5}>
                    {content}
                </Grid>

            </Modal.Content>

            <Modal.Actions>
                <Button
                    color='grey'
                    onClick={() => setModalState({ isOpen: false, dispatchProps: {} })}
                >
                    Close <Icon name='close right' />
                </Button>
                <Button
                    disabled={!selectedImage}
                    primary
                    onClick={() => handleOnSubmit()}
                >
                    Select Image <Icon name='chevron right' />
                </Button>
            </Modal.Actions>

        </Modal>
    )
}

export default ImageGalleryModal
