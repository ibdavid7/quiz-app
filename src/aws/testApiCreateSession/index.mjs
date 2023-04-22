import {
    TEST_TABLE, TEST_SESSIONS_TABLE, TEST_PURCHASES_TABLE,
    getItems, getItem, putItem, queryTable,
    STARTED, COMPLETED, CANCELLED, PURCHASES_GSI
} from "./utils.mjs";


export const handler = async (event, context, callback) => {

    const { testId } = JSON.parse(event.body);

    const userId = event.requestContext.authorizer.claims.sub;
    // console.log('userId claims: ', event.requestContext.authorizer);

    const uuid = context.awsRequestId;

    try {

        // check whether user has purchased the test
        const params_query_purchase = {
            TableName: TEST_PURCHASES_TABLE,
            IndexName: PURCHASES_GSI,
            KeyConditionExpression: 'userId = :value_userId AND testId = :value_testId',
            ExpressionAttributeValues: {
                ':value_userId': userId,
                ':value_testId': testId,
            },
            ProjectionExpression: "userId, testId",
            // By default, reads are eventually consistent. "ConsistentRead: true" represents
            // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
            // can also result in higher latency and a potential for server errors.
            ConsistentRead: false,
        }

        const purchase = await queryTable(params_query_purchase);

        if (purchase.Count > 0) {
            // fetch the test and create session


            const params_get_test = {
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

            const test = await getItem(params_get_test);

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

        } else {
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: 'Please purchase the test before attempting' })
            };
        }


    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: 'Error retrieving item. ' + err })
        };
    }

};