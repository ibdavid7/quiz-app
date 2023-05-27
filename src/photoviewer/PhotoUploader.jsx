import { Amplify, Auth, Storage } from 'aws-amplify';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
  Auth: {
    identityPoolId: 'us-east-1:50447a83-d751-4677-aef8-388b003ab533', //REQUIRED - Amazon Cognito Identity Pool ID
    region: 'us-east-1', // REQUIRED - Amazon Cognito Region
    userPoolId: 'us-east-1_94LETHrU8', //OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: '113366fbvvjibnkbgoedsj0kgs', //OPTIONAL - Amazon Cognito Web Client ID
  },
  Storage: {
    AWSS3: {
      bucket: 'quizlet-app', //REQUIRED -  Amazon S3 bucket name
      region: 'us-east-1', //OPTIONAL -  Amazon service region
    }
  }
});

import { StorageManager } from '@aws-amplify/ui-react-storage';

export const PhotoUploader = () => {
  return (
    <StorageManager
      acceptedFileTypes={['image/*']}
      accessLevel="public"
      maxFileCount={1}
      maxFileSize={10000}
      isResumable
    />
  );
};