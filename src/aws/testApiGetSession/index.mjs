import {
    ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems,
    getItem, sanitizeSessionQuestions, sanitizeSession,
    queryTable, insertPresignedUrls,
    STARTED, COMPLETED, CANCELLED
} from "./utils.mjs";

export const handler = async (event, context, callback) => {
    const expiresInSeconds = 60 * 60 * 3;
    const uuid = context.awsRequestId;
    const path_parameter = event.pathParameters['sessionId'];
    const userId = event.requestContext.authorizer.claims.sub;

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

        // check the userId matches
        res = res?.userId === userId
            // check status of the testSession    
            ? res.status === STARTED || res.status === CANCELLED
                // sanitize and remove answers
                ? sanitizeSession(res)
                // otherwise (i.e. COMPLETED) keep answers
                : res
            : null;

        // insert Presigned URLs for images: 1. instructions in config, 2. question image, 3. answer image (optional), 4. options images
        res = res
            ? res.status === STARTED || res.status === CANCELLED
                ? insertPresignedUrls(res, false, expiresInSeconds)
                : insertPresignedUrls(res, true, expiresInSeconds)
            : null;



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