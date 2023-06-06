import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Card, Icon, Image } from 'semantic-ui-react';
import { Amplify, Auth, Storage } from 'aws-amplify';

const bucket = "quizlet-app";



const ImageCardSimple = ({ image, selectedImage, copyUrl, selectImage }) => {

    const [signedUrl, setSignedUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {

            const signedUrl = await Storage.get(image.key, {
                level: 'private', // defaults to `public`
                // identityId?: string, // id of another user, if `level: protected`
                // download?: boolean, // defaults to false
                expires: 900, // validity of the URL, in seconds. defaults to 900 (15 minutes)
                contentType: 'image/*', // set return content type, eg "text/html"
                validateObjectExistence: true, // defaults to false
                // cacheControl?: string, // Specifies caching behavior along the request/reply chain
            });

            // console.log(signedUrl)
            setSignedUrl((prev) => signedUrl);
        };

        fetchData();
    }, []);

    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour12: false, hour: "2-digit", minute: "2-digit" };

    return (
        <Card>
            <Image size='medium' src={signedUrl} ui={true} rounded centered />
            <Card.Content>
                <Card.Description padded>
                    {`Last Modified: ${image.lastModified.toLocaleDateString("en-US", optionsDate)} - ${image.lastModified.toLocaleTimeString("en-US", optionsTime)}`}
                </Card.Description>

            </Card.Content>
            <Card.Content extra>
                <div className='ui two buttons'>
                    <Button
                        basic={selectedImage !== image.key}
                        color={'green'}
                        onClick={() => selectImage(image)}
                    >
                        <Icon name='check circle outline left' />
                        {selectedImage !== image.key ? 'Select Image' : 'Image Selected'}
                    </Button>
                    <Button
                        basic
                        color={'blue'}
                        onClick={() => copyUrl(image)}
                    >
                        <Icon name='copy left' />
                        Copy Url
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )
}

export default ImageCardSimple