import { TEST_TABLE, updateItem, getItem } from "./utils.mjs";
import { S3Client, ListObjectsCommand, ListObjectsV2Command, PutObjectTaggingCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({ region: "us-east-1" });


export const handler = async (event, context, callback) => {

    const uuid = context.awsRequestId;
    const path_parameter = event.pathParameters['testId'];
    const userId = event.requestContext.authorizer.claims.sub;

    // console.log('authorizer claims', event.requestContext.authorizer.claims)


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

        const item = await getItem(getTestParams);
        // console.log(item)
        const { authorId } = item;

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


        const [TITLES, OVERVIEW, CARD, TAGS, QUESTION_EDIT] = ['titles', 'overview', 'card', 'tags', 'questionEdit'];

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

            // 4. scope = 'questionEdit'
            case QUESTION_EDIT:
                const { question , questionIndex} = JSON.parse(event.body);

                params = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    UpdateExpression: `SET #map[${questionIndex}] = :new_value`,
                    ExpressionAttributeNames: {
                        '#list': 'questions',
                    },
                    ExpressionAttributeValues: {
                        ':new_value1': question,
                    }
                }

                break;

            // 5. scope = photo 'tags'
            case TAGS:
                const { tag, identityId } = JSON.parse(event.body);

                const bucket = "quizlet-app";
                const prefix = `private/${identityId}/${path_parameter}/`;
                // const tag = false;

                const params = {
                    Bucket: bucket,
                    Prefix: prefix,
                    // EncodingType: "url",
                };

                const data = await s3Client.send(new ListObjectsV2Command(params));

                // console.log("Success", data);


                if (data['Contents']) {

                    const res = await Promise.all(data["Contents"]
                        .filter((o) => Number(o["Size"]) > 0)
                        .map(async (o) => {
                            // console.log(o["Key"])
                            // TODO: retain existing tags, rather than override
                            const response = await setS3ObjectTag(bucket, o["Key"], tag);
                            // return response;
                        })
                    );

                    const response = {
                        statusCode: 200,
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                        },
                        body: JSON.stringify(res),
                    };

                    return response;
                } else {
                    return {
                        statusCode: 400,
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                        },
                        body: JSON.stringify({ message: `Error: No photos found to update tags for` })
                    };
                }



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


const setS3ObjectTag = async (bucket, key, tag) => {

    const params = {
        Bucket: bucket,
        Key: key,
        Tagging: {
            TagSet: [
                {
                    Key: "public",
                    Value: tag,
                },
            ],
        },
    };

    try {
        // TODO: retain existing tags, rather than override
        // console.log("key:", key);
        const data = await s3Client.send(new PutObjectTaggingCommand(params));
        // console.log("Success", data);

        return data;
    } catch (err) {
        console.log("Error", err);
        throw err;
    }
}