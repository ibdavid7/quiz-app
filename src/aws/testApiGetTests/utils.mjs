import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const DEFAULT_REGION = 'us-east-1';

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
