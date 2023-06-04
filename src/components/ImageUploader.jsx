import { Amplify, Auth, Storage } from 'aws-amplify';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import React from 'react'

Amplify.configure({
    Auth: {
        identityPoolId: 'us-east-1:50447a83-d751-4677-aef8-388b003ab533', //REQUIRED - Amazon Cognito Identity Pool ID
        region: 'us-east-1', // REQUIRED - Amazon Cognito Region
        userPoolId: 'us-east-1_94LETHrU8', //OPTIONAL - Amazon Cognito User Pool ID
        // userPoolWebClientId: '113366fbvvjibnkbgoedsj0kgs', //OPTIONAL - Amazon Cognito Web Client ID
    },
    Storage: {
        AWSS3: {
            bucket: 'quizlet-app', //REQUIRED -  Amazon S3 bucket name
            region: 'us-east-1', //OPTIONAL -  Amazon service region
        }
    }
});

const processFile = async ({ file, key }) => {

    const fileExtension = file.name.split('.').pop();

    return file
        .arrayBuffer()
        .then((filebuffer) => window.crypto.subtle.digest('SHA-1', filebuffer))
        .then((hashBuffer) => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                .map((a) => a.toString(16).padStart(2, '0'))
                .join('');
            return {
                file,
                key: `${hashHex}.${fileExtension}`,
                // key,
                tagging: 'public=true',
            };
        });
};

const ImageUploader = ({ testId }) => {
    return (

        <StorageManager
            acceptedFileTypes={[
                // you can list file extensions:
                '.jpeg',
                '.jpg',
                // or MIME types:
                'image/png',
                'image/*'
            ]}
            accessLevel="private"
            maxFileCount={10}
            maxFileSize={5000000}
            isResumable
            processFile={processFile}
            path={testId + '/'}
        />

    )
}

export default ImageUploader;