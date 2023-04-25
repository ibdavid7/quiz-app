import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export const DEFAULT_REGION = 'us-east-1';
export const [STARTED, COMPLETED, CANCELLED, PURCHASES_GSI] = ['Started', 'Completed', 'Cancelled', 'userId-testId-index'];


// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({ region: DEFAULT_REGION });

const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: true, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

// Create the DynamoDB document client.
export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);


export const TEST_TABLE = 'Tests';
export const TEST_SESSIONS_TABLE = 'TestSessions';
export const TEST_PURCHASES_TABLE = 'TestPurchases';

export const getItems = async (params) => {

    const { Items } = await ddbDocClient.send(
        new ScanCommand(params)
    );

    return Items;

};

export const getItem = async (params) => {
    const { Item } = await ddbDocClient.send(
        new GetCommand(params)
    );

    return Item;
};


export const putItem = async (params) => {

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        // console.log("Success - item added or updated", data);
        return data;
    } catch (err) {
        console.log("Error", err.stack);
    }
}

export const queryTable = async (params) => {

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        // console.log("Success - item added or updated", data);
        return data;
    } catch (err) {
        console.log("Error", err.stack);
    }
}

export const updateItem = async (params) => {

    try {
        const data = await ddbDocClient.send(new UpdateCommand(params));
        return data;
    } catch (err) {
        console.log("Error", err.stack);
    }
}

export const sanitizeSession = (session) => {
    const { questions } = session;
    const updatedQuestions = questions.map(({ answer_id, answer_image, answer_text, ...rest }) => {
        return {
            ...rest,
        }
    })

    return {
        ...session,
        questions: updatedQuestions,
    }

}


export const sanitizeSessionQuestions = (questions) => {
    // const { questions } = session;
    const updatedQuestions = questions.map(({ answer_id, answer_image, answer_text, ...rest }) => {
        return {
            ...rest,
        }
    })

    return updatedQuestions;

}

export const extractBucketNameAndObjectKey = (objectUrl) => {
    const s3UrlParts = objectUrl.split('/');
    const bucket = s3UrlParts[2].split('.')[0];
    const key = s3UrlParts.slice(3).join('/');

    return {
        bucket,
        key,
    }
}


const s3Client = new S3Client({ region: DEFAULT_REGION });

export const generatePresignedUrl = async (objectUrl, expiresInSeconds) => {
    // https://quizlet-app.s3.amazonaws.com/tests/gg69b4a9-47e7-4e74-bf51-8c9bd9d08nef/instructions_image.png

    // quizlet-app
    //tests/gg69b4a9-47e7-4e74-bf51-8c9bd9d08nef/instructions_image.png
    if (!objectUrl) {
        return null;
    }

    const { bucket, key } = extractBucketNameAndObjectKey(objectUrl);
    // const bucket = 'quizlet-app';
    // const key = 'tests/gg69b4a9-47e7-4e74-bf51-8c9bd9d08nef/instructions_image.png'

    const command = new GetObjectCommand({ Bucket: bucket, Key: key });

    const url = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });

    // console.log('s3ClientName: ', s3Client);

    return url;
}

// console.log('utils ran')

export const insertPresignedUrls = async (session, answersIncluded = false, expiresInSeconds = 3600) => {
    // 1. instruction image
    const { config: { instructions_image, ...restConfig }, questions, ...restSession } = session;
    const updated_instructions_image = await generatePresignedUrl(instructions_image, expiresInSeconds);

    // 2. questions image and optionally 3. answers image and options
    const updatedQuestions = await Promise.all(questions.map(async ({ answer_image, question_image, options, ...restQuestion }) => {

        answer_image = await generatePresignedUrl(answer_image, expiresInSeconds);
        question_image = await generatePresignedUrl(question_image, expiresInSeconds);

        options = await Promise.all(options.map(async ({ option_image, ...restOption }) => {
            option_image = await generatePresignedUrl(option_image, expiresInSeconds);
            return {
                ...restOption,
                option_image,
            }
        }))


        if (answersIncluded) {
            return {
                ...restQuestion,
                answer_image,
                question_image,
                options
            }
        } else {
            return {
                ...restQuestion,

                question_image,
                options
            }
        }

    }))

    const result = {
        ...restSession,
        config: {
            ...restConfig,
            instructions_image: updated_instructions_image,
        },
        questions: updatedQuestions,
    };

    // console.log(result);

    return result;

}


