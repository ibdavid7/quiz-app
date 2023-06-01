import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react'
import { Amplify, Auth, Storage } from 'aws-amplify';
import { Grid, Image } from 'semantic-ui-react'
import PlaceholderComponent from './PlaceholderComponent'

// import {AmplifyS3Album} from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";
import ImageCard from './ImageCard';

// Amplify.configure({
// Auth: {
//     identityPoolId: 'us-east-1:50447a83-d751-4677-aef8-388b003ab533', //REQUIRED - Amazon Cognito Identity Pool ID
//     region: 'us-east-1', // REQUIRED - Amazon Cognito Region
//     userPoolId: 'us-east-1_94LETHrU8', //OPTIONAL - Amazon Cognito User Pool ID
//     userPoolWebClientId: '113366fbvvjibnkbgoedsj0kgs', //OPTIONAL - Amazon Cognito Web Client ID
// },
// Storage: {
//     AWSS3: {
//         bucket: 'quizlet-app', //REQUIRED -  Amazon S3 bucket name
//         region: 'us-east-1', //OPTIONAL -  Amazon service region
//     }
// }
// });

// Amplify.configure(awsconfig);

// const App = () => <AmplifyS3Album />;



// TODO: create SORT and FILTER functionality
const ImageGallery = ({ testId }) => {

    const [images, setImages] = useState([]);

    const PAGE_SIZE = 5;
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


    const content = images.map((image) => {
        // console.log(image.key)
        return (
            <Grid.Column key={image.key}>
                {/* <ImageCard eTag={image.eTag} key={image.key} lastModified={image.lastModified}/> */}
                <ImageCard image={image} />
                {/* <ImageCard /> */}
            </Grid.Column>
        );
    })

    return (
        <Container>
            <Grid relaxed columns={4}>
                {content}
                {/* {console.log(content)} */}
            </Grid>
        </Container>
    )
}

export default ImageGallery
