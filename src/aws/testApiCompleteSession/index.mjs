// const r = {
//     results: {
//         "type": "normal_distribution",
//         "point_score_total": score,
//         "point_score_result": score,
//         "questions_total": total,
//         "questions_answered": subtotal,
//         "questions_answered_correctly": subtotal,
//         "percentile": percentile,
//         "confidence_level": confidence_level,
//         "results_text": results_text,
//         "results_image": results_image,
//     }
// }


import { TEST_SESSIONS_TABLE, getItem, updateItem } from "./utils.mjs";

const [STARTED, COMPLETED, CANCELLED] = ['Started', 'Completed', 'Cancelled'];

const [ANSWERS, RESULTS] = ['answers', 'results'];

export const handler = async (event, context, callback) => {

    // console.log('event: ', event)
    // console.log('context: ', context)

    // const uuid = context.awsRequestId;')

    // const uuid = context.awsRequestId;
    const path_parameter = event.pathParameters['sessionId'];
    const { action } = JSON.parse(event.body);
    // TODO update with authentication
    const userId = event.requestContext.authorizer.claims.sub;
    // console.log('action: ', action)
    // console.log('userId:', userId)

    if (action == STARTED) {
        // TODO: stop execution and return
        return;
    } else if (action == CANCELLED) {
        // TODO: set status to cancelled
        return;
    } else if (action == COMPLETED) {
        // TODO: PERFORM COMPLETION

        const params_get = {
            TableName: TEST_SESSIONS_TABLE,
            Key: {
                id: path_parameter,
            },
            // By default, reads are eventually consistent. "ConsistentRead: true" represents
            // a strongly consistent read. This guarantees that the most up-to-date data is returned. It
            // can also result in higher latency and a potential for server errors.
            ConsistentRead: true,
        }



        try {

            const session = await getItem(params_get);

            // EEROR HANDLING: session doesn't exist; OR user is not the owner; OR Session is already completed or cancelled
            if (!session) {
                const response = {
                    statusCode: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ Error: `Bad Request: Session ID: ${path_parameter} not found` }),
                };
                return response;
            }

            if (session.userId !== userId) {
                const response = {
                    statusCode: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ Error: `Bad Request: Session ID: ${path_parameter} does not belong to logged in user` }),
                };
                return response;
            }

            if (session.status !== STARTED) {
                const response = {
                    statusCode: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ Error: `Bad Request: Session ID: ${path_parameter} is already completed or cancelled` }),
                };
                return response;
            }


            // Scoring function
            const questions = session.questions;
            const answers = session.answers;
            // console.log('answers: ', answers)

            // TODO: provide breakdown by question label e.g. numerical, verbal etc')

            // TODO: provide breakdown by question label e.g. numerical, verbal etc
            const scoring = {
                test: {
                    score_available: 0,
                    score_result: 0,
                    questions_available: 0,
                    questions_answered: 0,
                    questions_correct: 0,
                }
            };

            // Perform scoring in 3 steps:
            // 1. Prepare the results array by question
            // 2. Calculate the total score using test specific methodology
            // 3. Interpret and evaluate score against the base results ditribution function to get the percentile
            // TODO: test for correctness

            // TODO: this only works for multiple choice questions question.type=multiple; generify for direct input



            const results = questions.reduce((acc, question) => {
                const questionId = question.question_id;
                const currectAnswerId = question.answer_id;
                const scoreAvailable = question.score;
                const actualAnswerId = answers[questionId];
                // console.log('questionId', questionId);
                // console.log('correctAnswerId', currectAnswerId);
                // console.log('actualAnswerId', actualAnswerId);
                // console.log('score result:', (currectAnswerId === actualAnswerId ? scoreAvailable : 0))

                const labels = ['test'];
                if (question.label) {
                    labels.push(question.label);
                }
                if (question.difficulty) {
                    labels.push(question.difficulty);

                }

                let result = {}

                labels.forEach(label => {
                    result = {
                        ...acc,
                        ...result,
                        [label]: {
                            score_available: (acc?.[label]?.score_available ?? 0) + scoreAvailable,
                            score_result: (acc?.[label]?.score_result ?? 0) + (currectAnswerId === actualAnswerId ? scoreAvailable : 0),
                            questions_available: (acc?.[label]?.questions_available ?? 0) + 1,
                            questions_answered: (acc?.[label]?.questions_answered ?? 0) + (actualAnswerId ? 1 : 0),
                            questions_correct: (acc?.[label]?.questions_correct ?? 0) + (currectAnswerId === actualAnswerId ? 1 : 0),
                        }
                    }
                })

                return result;


            }, scoring);


            const params_update = {
                TableName: TEST_SESSIONS_TABLE,
                Key: {
                    id: path_parameter,
                },
                UpdateExpression: 'SET #map = :new_value, #status = :status_value, #end = :end_value',
                ExpressionAttributeNames: {
                    '#map': RESULTS,
                    '#status': 'status',
                    '#end': 'endTime',
                },
                ExpressionAttributeValues: {
                    ':new_value': results,
                    ':status_value': COMPLETED,
                    ':end_value': Date.now(),
                }
            }


            let res = await updateItem(params_update);

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
                body: JSON.stringify({ message: `Error processing item: ${err}` })
            };
        }


    } else {
        const response = {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ Error: "Bad Request: Test Session Status Update Not Recognized" }),
        };
        return response;
    }



};