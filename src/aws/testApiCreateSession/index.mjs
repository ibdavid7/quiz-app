import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, putItem } from "./utils.mjs";

const [STARTED, COMPLETED, CANCELLED] = ['Started', 'Completed', 'Cancelled'];

export const handler = async (event, context, callback) => {

    const { testId } = JSON.parse(event.body);

    const userId = event.requestContext.authorizer.claims.sub;
    // console.log('userId claims: ', event.requestContext.authorizer);

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

        const obj = test.questions.reduce((acc, curr) => {
            acc[curr.question_id] = { answer: "" };
            return acc;
        }, {});

        const params_put = {
            TableName: TEST_SESSIONS_TABLE,
            Item: {
                ...test,
                id: uuid,
                testId,
                userId,
                answers: obj,
                status: STARTED,
                start: Date.now(),
            },
        };

        const putSession = await putItem(params_put);

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ sessionId: uuid }),
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