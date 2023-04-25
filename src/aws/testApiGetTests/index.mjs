import { TEST_TABLE, TEST_SESSIONS_TABLE, TEST_PURCHASES_TABLE, getItems, queryTable, PURCHASES_GSI } from "./utils.mjs";
import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { CognitoJwtVerifier } from "aws-jwt-verify";


const [STARTED, COMPLETED, CANCELLED] = ['Started', 'Completed', 'Cancelled'];


export const handler = async (event, context, callback) => {

    // console.log(event);
    // const { testId, userId } = JSON.parse(event.body);
    // const testId = event.pathParameters.testId;
    // console.log(testId, userId);

    const authorizerHeader = event.headers.Authorization;
    // console.log('userId claims: ', authorizerHeader);

    const uuid = context.awsRequestId;

    // TODO allow for different test categories in the getTest API
    const category = 'iq';

    const params = {
        TableName: TEST_TABLE,
        FilterExpression: "config.category = :topic",
        ExpressionAttributeValues: {
            ":topic": category,
        },
        ProjectionExpression: "id, config",
    }

    try {
        // const test = await getTest(TEST_TABLE, testId);


        // console.log(item);
        // const putSession = await addTestSession(TEST_SESSIONS_TABLE, test, userId, uuid);
        // console.log(data);

        // const session = await getTest(TEST_SESSIONS_TABLE, uuid);

        // if user is authorised, get the list of tests already purchased and build a lookup map

        let res;

        if (authorizerHeader) {
            // const idToken = authorizerHeader;
            // const decodedIdToken = decodeJwt({ IdToken: idToken });

            // Verifier that expects valid access tokens:
            const verifier = CognitoJwtVerifier.create({
                userPoolId: "us-east-1_94LETHrU8",
                tokenUse: "id",
                clientId: "113366fbvvjibnkbgoedsj0kgs",
            });


            const { sub: userId } = await verifier.verify(
                // the JWT as string
                authorizerHeader
            );

            console.log('sub: ', userId);


            // check whether user has purchased the test
            const params_query_purchase = {
                TableName: TEST_PURCHASES_TABLE,
                IndexName: PURCHASES_GSI,
                KeyConditionExpression: 'userId = :value_userId',
                ExpressionAttributeValues: {
                    ':value_userId': userId,
                },
                ProjectionExpression: "userId, testId",
                // By default, reads are eventually consistent. "ConsistentRead: true" represents
                // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
                // can also result in higher latency and a potential for server errors.
                ConsistentRead: false,
            }

            const { Items } = await queryTable(params_query_purchase);
            // console.log('purchases: ', Items);

            const testPurchaseMap = Items.reduce((obj, item) => Object.assign(obj, { [item.testId]: true }), {});

            // console.log(testPurchaseMap);

            res = await getItems(params);
            console.log(res);

            res = res.map(item => {
                return {
                    ...item,
                    isPurchased: !!testPurchaseMap[item.id],
                }
            });


        } else {
            // user not logged in

            // TODO rewrite for query rather than scan and limit no. of items returned
            res = await getItems(params);
        }


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
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: `Error retrieving item: ${err}` })
        };
    }

};