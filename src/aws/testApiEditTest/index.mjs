import { TEST_TABLE, updateItem, getItem } from "./utils.mjs";

export const handler = async (event, context, callback) => {

    const uuid = context.awsRequestId;
    const path_parameter = event.pathParameters['testId'];
    const userId = event.requestContext.authorizer.claims.sub;


    const { scope } = JSON.parse(event.body);


    try {

        // authorId check
        const getTestParams = {
            TableName: TEST_TABLE,
            Key: {
                id: path_parameter,
            },
            // By default, reads are eventually consistent. "ConsistentRead: true" represents
            // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
            // can also result in higher latency and a potential for server errors.
            ConsistentRead: false,
            // IMPORTANT: list of attributes that is passed to the public getTest call
            ProjectionExpression: "id, authorId",
        }

        const { authorId } = await getItem(getTestParams);

        if (authorId !== userId) {
            console.log(`Error: User ${userId} not authorised to edit this test`);
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ message: `Error: User ${userId} not authorised to edit this test` })
            };
        }


        const [TITLES, OVERVIEW, CARD] = ['titles', 'overview', 'card'];

        // Check the scope of the editRequest

        // 1. scope = 'titles'
        // 2. scope = 'overview'
        // 3. scope = 'card'

        let params;
        switch (scope) {
            // 1. scope = 'titles'
            case TITLES:
                const { title, subtitle } = JSON.parse(event.body);

                params = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    UpdateExpression: 'SET #map.#nested_map1 = :new_value1,  #map.#nested_map2 = :new_value2',
                    ExpressionAttributeNames: {
                        '#map': 'product_summary',
                        '#nested_map1': 'title',
                        '#nested_map2': 'subtitle',
                    },
                    ExpressionAttributeValues: {
                        ':new_value1': title,
                        ':new_value2': subtitle,
                    }
                }

                break;

            // 2. scope = 'overview'
            case OVERVIEW:
                const { overview } = JSON.parse(event.body);

                params = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    UpdateExpression: 'SET #map.#nested_map1 = :new_value1',
                    ExpressionAttributeNames: {
                        '#map': 'product_summary',
                        '#nested_map1': 'overview',
                    },
                    ExpressionAttributeValues: {
                        ':new_value1': overview,
                    }
                }

                break;

            default:
                console.log(`Error: Scope of the update request: ${scope} not recognized`);
                return {
                    statusCode: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ message: `Error: Scope of the update request: ${scope} not recognized` })
                };
        }


        // params = {
        //     TableName: TEST_SESSIONS_TABLE,
        //     Key: {
        //         id: path_parameter,
        //     },
        //     UpdateExpression: 'SET #map.#nested_map = :new_value, #item_attribute = :new_value2',
        //     ExpressionAttributeNames: {
        //         '#map': ANSWERS,
        //         '#nested_map': questionId,
        //         '#item_attribute': RESUME_QUESTION_INDEX,

        //     },
        //     ExpressionAttributeValues: {
        //         ':new_value': optionId,
        //         ':new_value2': questionIndex,
        //     }
        // }

        let res = await updateItem(params);

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