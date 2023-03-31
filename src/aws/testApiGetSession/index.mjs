import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, sanitizeSessionQuestions, sanitizeSession, queryTable } from "./utils.mjs";

export const handler = async (event, context, callback) => {

    const uuid = context.awsRequestId;
    const path_parameter = event.pathParameters['sessionId'];
    const userId = 'userId2';

    const params = {
        TableName: TEST_SESSIONS_TABLE,
        Key: {
            id: path_parameter,
        },
        // By default, reads are eventually consistent. "ConsistentRead: true" represents
        // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
        // can also result in higher latency and a potential for server errors.
        ConsistentRead: false,
        // ProjectionExpression: "id, config",
    }

    try {

        let res = await getItem(params);

        res = res.userId === userId ? sanitizeSession(res) : null;

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(res),
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