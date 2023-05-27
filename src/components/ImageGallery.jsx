import React from 'react';
import { Container } from 'semantic-ui-react'
import PlaceholderComponent from './PlaceholderComponent'

import { Amplify } from "aws-amplify";
import {AmplifyS3Album} from "@aws-amplify/ui-react";
import awsconfig from "../aws-exports";

Amplify.configure(awsconfig);

// const App = () => <AmplifyS3Album />;

const ImageGallery = () => {
    return (
        <Container>
            <AmplifyS3Album />
        </Container>
    )
}

export default ImageGallery
