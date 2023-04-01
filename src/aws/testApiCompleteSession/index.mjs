const r = {
    results: {
        "type": "normal_distribution",
        "point_score_total": score,
        "point_score_result": score,
        "questions_total": total,
        "questions_answered": subtotal,
        "questions_answered_correctly": subtotal,
        "percentile": percentile,
        "confidence_level": confidence_level,
        "results_text": results_text,
        "results_image": results_image,
    }
}


import { toContainHTML } from "@testing-library/jest-dom/dist/matchers.js";
import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, sanitizeSessionQuestions, sanitizeSession, queryTable, updateItem, putItem } from "./utils.mjs";

const [STARTED, COMPLETED, CANCELLED] = ['Started', 'Completed', 'Cancelled'];

const [ANSWER, ANSWERS, RESULTS] = ['answer', 'answers', 'results'];

export const handler = async (event, context, callback) => {

    // const uuid = context.awsRequestId;
    const path_parameter = event.pathParameters['sessionId'];
    const { status } = JSON.parse(event.body);
    // TODO update with authentication
    // const userId = 'userId2';

    if (status == STARTED) {
        // TODO: reopen the session
    } else if (status == CANCELLED) {
        // TOTO: set status to cancelled
    } else if (status == COMPLETED) {
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

            // TODO: Authentication on userId

            if (!session) {
                const response = {
                    statusCode: 400,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({ Error: `Bad Request: Session ID: ${sessionId} not found` }),
                };
                return response;
            }
            // TODO: test for correctness
            const questions = session.questions;
            const answers = session.answers;

            const results = {
                point_score_total: 0,
                point_score_result: 0,
                questions_total: questions.length,
                questions_answered: 0,
                questions_answered_correctly: 0,
            };

            questions.reduce((question) => {
                const questionId = question.question_id;
                const currectAnswerId = question.answer_id;
                const scoreAvailable = question.score;
                const actualAnswerId = answers.question_id[ANSWER];

                return {
                    ...results,
                    point_score_total: results.point_score_total + scoreAvailable,
                    point_score_result: results.point_score_result + currectAnswerId === actualAnswerId ? scoreAvailable : 0,
                    questions_answered: results.questions_answered + actualAnswerId ? 1 : 0,
                    questions_answered_correctly: results.questions_answered_correctly + currectAnswerId === actualAnswerId ? 1 : 0,
                }


            }, results);


            const params_update = {
                TableName: TEST_SESSIONS_TABLE,
                Key: {
                    id: path_parameter,
                },
                UpdateExpression: 'SET #map = :new_value',
                ExpressionAttributeNames: {
                    '#map': RESULTS,
                },
                ExpressionAttributeValues: {
                    ':new_value': results,
                }
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
                body: JSON.stringify({ message: `Error retrieving item: ${err}` })
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