import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, sanitizeSessionQuestions } from "./utils.mjs";

export const handler = async (event, context, callback) => {

    const uuid = context.awsRequestId;
    const path_parameter = event.pathParameters['sessionId'];

    const params = {
        TableName: TEST_SESSIONS_TABLE,
        Key: {
            id: path_parameter,
        },
        // By default, reads are eventually consistent. "ConsistentRead: true" represents
        // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
        // can also result in higher latency and a potential for server errors.
        ConsistentRead: false,
        ProjectionExpression: "questions",
    }

    try {

        const questions = await getItem(params);

        const sanitizedQuestions = sanitizeSessionQuestions(questions);

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(sanitizedQuestions),
        };

        return response;

    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Error retrieving item: ${err}` })
        };
    }

};