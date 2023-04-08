import { TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, putItem } from "./utils.mjs";

const [STARTED, COMPLETED, CANCELLED] = ['Started', 'Completed', 'Cancelled'];

// TODO refactor as query instead of scan with userID as secondary index

export const handler = async (event, context, callback) => {

    const userId = event.requestContext.authorizer.claims.sub;

    // const uuid = context.awsRequestId;

    try {

        const params_scan = {
            TableName: TEST_SESSIONS_TABLE,
            FilterExpression: "#attrName = :attrValue",
            ExpressionAttributeNames: {
                "#attrName": "userId",
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":attrValue": userId,
            },
            ProjectionExpression: "id, config, userId, testId, #status",
            // By default, reads are eventually consistent. "ConsistentRead: true" represents
            // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
            // can also result in higher latency and a potential for server errors.
            // ConsistentRead: false,
        }

        const res = await getItems(params_scan);

        // console.log('result:', res)

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