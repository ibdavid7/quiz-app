import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, putItem } from "./utils.mjs";

const [STARTED, COMPLETED, CANCELLED] = ['Started', 'Completed', 'Cancelled'];

// TODO refactor as query instead of scan with userID as secondary index

export const handler = async (event, context, callback) => {

    const { userId } = JSON.parse(event.body);

    const uuid = context.awsRequestId;

    try {

        const params_get = {
            TableName: TEST_TABLE,
            Key: {
                id: testId,
            },
            // By default, reads are eventually consistent. "ConsistentRead: true" represents
            // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
            // can also result in higher latency and a potential for server errors.
            ConsistentRead: false,
            // ProjectionExpression: "id, config",
        }

        const test = await getItem(params_get);

        const params = {
            TableName: TEST_SESSIONS_TABLE,
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":topic": userId,
            },
            ProjectionExpression: "id, config, userId, testId",
        }

        const res = await getItems(params);

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
            body: JSON.stringify({ message: 'Error retrieving item' })
        };
    }

};