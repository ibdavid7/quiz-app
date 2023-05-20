import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, queryTable } from "./utils.mjs";

export const handler = async (event, context, callback) => {

    const uuid = context.awsRequestId;
    const path_parameter = event.pathParameters['testId'];
    const userId = event.requestContext.authorizer.claims.sub;
    // console.log('testId:', path_parameter)
    // console.log('userId:', userId)

    const query_params = {
        TableName: TEST_TABLE,
        KeyConditionExpression: "#pk = :pk",
        FilterExpression: "#authorId = :authorId",
        ExpressionAttributeNames: {
            "#pk": "id",
            "#authorId": "authorId",
        },
        ExpressionAttributeValues: {
            ":pk": path_parameter,
            ":authorId": userId,
        },
        // By default, reads are eventually consistent. "ConsistentRead: true" represents
        // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
        // can also result in higher latency and a potential for server errors.
        ConsistentRead: true,
    }


    try {

        const res = await queryTable(query_params);
        // console.log(res['Items'][0]);


        let response;

        // Success in retrieving exactly 1 item where authorId = userId, else error: not authorised
        if (res?.['Count'] === 1) {
            response = {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(res['Items'][0]),
            };
        } else {
            response = {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: `Error retrieving item: ${userId} not authorised to edit testId ${path_parameter}` }),
            };
        }

        return response;

    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Error retrieving item: ${err}` })
        };
    }

};