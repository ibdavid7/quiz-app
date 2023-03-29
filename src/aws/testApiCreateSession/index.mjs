// myTestApiFunction

import {DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({region: "us-east-1"});


const DEFAULT_REGION = 'us-east-1';

// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDBClient({region: DEFAULT_REGION});

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

// Create the DynamoDB document client.
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, {
    marshallOptions,
    unmarshallOptions,
});

const TEST_TABLE = 'Tests';
const TEST_SESSIONS_TABLE = 'TestSessions';
const [STARTED, COMPLETED, CANCELLED] = ['Started', 'Completed', 'Cancelled'];


const getTest = async (tableName, id) => {
    const {Item} = await ddbDocClient.send(
        new GetCommand({
            TableName: tableName,
            Key: {
                id,
            },
            // By default, reads are eventually consistent. "ConsistentRead: true" represents
            // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
            // can also result in higher latency and a potential for server errors.
            ConsistentRead: false,
        })
    );

    return Item;
};

const addTestSession = async (tableName, test, userId, uuid) => {

    // Set the parameters.

    const {id, ...rest} = test;

    const params = {
        TableName: tableName,
        Item: {
            id: uuid,
            testId: id,
            userId,
            answers: {},
            status: STARTED,
            start: Date.now(),
            ...rest,
        },
    };

    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        // console.log("Success - item added or updated", data);
        return data;
    } catch (err) {
        console.log("Error", err.stack);
    }
}

const sanitizeAnswers = (session) => {
    const {questions} = session;
    const updatedQuestions = questions.map(({answer_id, answer_image, answer_text, ...rest}) => {
        return {
            ...rest,
        }
    })

    return {
        ...session,
        questions: updatedQuestions,
    }

}


export const handler = async (event, context, callback) => {

    // console.log(event);
    const {testId, userId} = JSON.parse(event.body);
    // const testId = event.pathParameters.testId;
    // console.log(testId, userId);
    const uuid = context.awsRequestId;

    try {
        const test = await getTest(TEST_TABLE, testId);

        // console.log(item);
        const putSession = await addTestSession(TEST_SESSIONS_TABLE, test, userId, uuid);
        // console.log(data);

        const session = await getTest(TEST_SESSIONS_TABLE, uuid);

        const response = {
            statusCode: 200,
            body: JSON.stringify(sanitizeAnswers(session)),
        };
        return response;

    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Error retrieving item'})
        };
    }

};