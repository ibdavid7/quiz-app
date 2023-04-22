import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, TEST_PURCHASES_TABLE, getItems, getItem, putItem } from "./utils.mjs";

const [STARTED, COMPLETED, CANCELLED] = ['Started', 'Completed', 'Cancelled'];

export const handler = async (event, context, callback) => {

    const { id } = JSON.parse(event.body);

    const userId = event.requestContext.authorizer.claims.sub;
    // console.log('userId claims: ', event.requestContext.authorizer);

    const uuid = context.awsRequestId;


    try {

        // TODO add scenario that user already purchased the test in the past (PK userId, SK testId)



        const params_get = {
            TableName: TEST_TABLE,
            Key: {
                id: id,
            },
            // By default, reads are eventually consistent. "ConsistentRead: true" represents
            // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
            // can also result in higher latency and a potential for server errors.
            ConsistentRead: false,
            // ProjectionExpression: "id, config",
        }

        const test = await getItem(params_get);

        // TODO add error handling if test doesn't exist

        let response;

        if (test) {

            const params_put = {
                TableName: TEST_PURCHASES_TABLE,
                Item: {
                    price: test.config.price,
                    testId: id,
                    test: test.config.label,
                    id: uuid,
                    userId,
                    date: Date.now(),
                },
            };

            const putSession = await putItem(params_put);

            response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    purchaseId: uuid,
                    total: test.config.price,
                }),
            };

        } else {

            response = {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    error: 'Bad Request: No such test found'
                }),
            };


        }

        return response;

    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing the transaction. ' + err })
        };
    }

};