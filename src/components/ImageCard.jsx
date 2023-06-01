import React, { useEffect, useState } from 'react';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Amplify, Auth, Storage } from 'aws-amplify';



const ImageCard = ({ image }) => {

    // console.log('key', image.key)
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

    const truncateString = (str, num = 10) => {
        // If the length of str is less than or equal to num
        // just return str--don't truncate it.
        if (str.length <= num) {
            return str
        }
        // Return str truncated with '...' concatenated to the end of str.
        return str.slice(0, num) + '...'
    }

    return (
        <Card>
            <Image src={signedUrl} wrapped ui={false} />
            <Card.Content>
                <Card.Header>Last Modified</Card.Header>
                {/* <Card.Meta>Joined in 2016</Card.Meta> */}
                <Card.Description>
                    {`${image.lastModified.toLocaleDateString("en-US", optionsDate)} - ${image.lastModified.toLocaleTimeString("en-US", optionsTime)}`}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <a
                    onClick={() => { navigator.clipboard.writeText(image.key) }}
                >
                    <Icon name='copy' />
                    {`Copy Key: ${truncateString(image.key.split('/')[1], 15)}`}
                </a>
            </Card.Content>
        </Card>
    )
}

export default ImageCard