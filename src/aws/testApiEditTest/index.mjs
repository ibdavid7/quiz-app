import { TEST_TABLE, updateItem, getItem } from "./utils.mjs";
import { S3Client, ListObjectsCommand, ListObjectsV2Command, PutObjectTaggingCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({ region: "us-east-1" });

const [TITLES, OVERVIEW, CARD, CONFIG, SCORING, TAGS, QUESTION_EDIT, QUESTION_ADD, QUESTION_DELETE, QUESTION_ORDER] =
    ['titles', 'overview', 'card', 'config', 'scoring', 'tags', 'questionEdit', 'questionAdd', 'questionDelete', 'questionOrder'];


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



        // Check the scope of the editRequest


        var params;

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

            // 3. scope = 'card'
            case CARD:

                const { card } = JSON.parse(event.body);

                params = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    UpdateExpression: 'SET #map = :new_value1',
                    ExpressionAttributeNames: {
                        '#map': 'product_card',
                    },
                    ExpressionAttributeValues: {
                        ':new_value1': card,
                    }
                }

                break;

            // 4. scope = 'config'
            case CONFIG:

                const { config } = JSON.parse(event.body);

                params = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    UpdateExpression: 'SET #map = :new_value1',
                    ExpressionAttributeNames: {
                        '#map': CONFIG,
                    },
                    ExpressionAttributeValues: {
                        ':new_value1': config,
                    }
                }

                break;

            // 5. scope = 'scoring'
            case SCORING:

                const { scoring } = JSON.parse(event.body);

                params = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    UpdateExpression: 'SET #map1.#map2 = :new_value1',
                    ExpressionAttributeNames: {
                        '#map1': CONFIG,
                        '#map2': SCORING,

                    },
                    ExpressionAttributeValues: {
                        ':new_value1': scoring,
                    }
                }

                break;

            // 6a. scope = 'questionEdit'
            case QUESTION_EDIT:
                var { question, questionIndex } = JSON.parse(event.body);

                params = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    UpdateExpression: `SET #list[${questionIndex}] = :new_value1`,
                    ExpressionAttributeNames: {
                        '#list': 'questions',
                    },
                    ExpressionAttributeValues: {
                        ':new_value1': question,
                    }
                }


                break;

            // 6b. scope = 'questionAdd'
            case QUESTION_ADD:
                // var { questionIndex } = JSON.parse(event.body);

                const questList = [{
                    question_id: uuid,
                    answer: {
                        answer_id: '',
                        answer_image: '',
                        answer_text: '',
                    },
                    difficulty: '',
                    label: '',
                    layout: '',
                    options: [],
                    question_image: '',
                    question_text: '',
                    score: 1,
                    type: '',
                }]

                params = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    UpdateExpression: `SET #list = list_append(#list, :new_value1)`,
                    ExpressionAttributeNames: {
                        '#list': 'questions',
                    },
                    ExpressionAttributeValues: {
                        ':new_value1': questList,
                    }
                }


                break;

            // 6c. scope = 'questionDelete'
            case QUESTION_DELETE:
                var { questionIndex } = JSON.parse(event.body);

                params = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    UpdateExpression: `REMOVE #list[${questionIndex}]`,
                    ExpressionAttributeNames: {
                        '#list': 'questions',
                    },
                    // ExpressionAttributeValues: {
                    //     ':new_value1': questList,
                    // }
                }


                break;

            // 7. scope = 'questionOrder'
            case QUESTION_ORDER:
                var { sourceIndex, destinationIndex } = JSON.parse(event.body);

                // getQuestions
                const getTestParam = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    // By default, reads are eventually consistent. "ConsistentRead: true" represents
                    // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
                    // can also result in higher latency and a potential for server errors.
                    ConsistentRead: true,
                    // IMPORTANT: list of attributes that is passed to the public getTest call
                    ProjectionExpression: "questions",
                }

                const item = await getItem(getTestParam);
                const { questions } = item;
                // create array copy and reorder
                const items = Array.from(questions)
                const [reorderedItem] = items.splice(sourceIndex, 1);
                items.splice(destinationIndex, 0, reorderedItem);

                params = {
                    TableName: TEST_TABLE,
                    Key: {
                        id: path_parameter,
                    },
                    UpdateExpression: `SET #list = :new_value1`,
                    ExpressionAttributeNames: {
                        '#list': 'questions',
                    },
                    ExpressionAttributeValues: {
                        ':new_value1': items,
                    }
                }


                break;



            // 8. scope = photo 'tags'
            case TAGS:
                const { tag, identityId } = JSON.parse(event.body);

                const bucket = "quizlet-app";
                const prefix = `private/${identityId}/${path_parameter}/`;
                // const tag = false;

                params = {
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