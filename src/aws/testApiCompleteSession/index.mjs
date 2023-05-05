import { TEST_SESSIONS_TABLE, getItem, updateItem } from "./utils.mjs";
import { cdf } from './cdf.mjs';

const [STARTED, COMPLETED, CANCELLED] = ['Started', 'Completed', 'Cancelled'];

const [ANSWERS, RESULTS] = ['answers', 'results'];

export const handler = async (event, context, callback) => {

    // console.log('event: ', event)
    // console.log('context: ', context)
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
                summary: {
                    test: {
                        score_available: 0,
                        score_result: 0,
                        questions_available: 0,
                        questions_answered: 0,
                        questions_correct: 0,
                    },
                    results: {
                        score: 0,
                        percentile: 0,
                    }
                },
                labels: {},
                difficulty: {},
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

                const segments = [{ summary: 'test' }];
                if (question.label) {
                    segments.push({ labels: question.label });
                }
                if (question.difficulty) {
                    segments.push({ difficulty: question.difficulty });

                }

                let result = structuredClone(acc);

                segments.forEach((elem) => {

                    Object.entries(elem).forEach(([key, value]) => {

                        result[key][value] = {
                            score_available: (result?.[key]?.[value]?.score_available ?? 0) + scoreAvailable,
                            score_result: (result?.[key]?.[value]?.score_result ?? 0) + (currectAnswerId === actualAnswerId ? scoreAvailable : 0),
                            questions_available: (result?.[key]?.[value]?.questions_available ?? 0) + 1,
                            questions_answered: (result?.[key]?.[value]?.questions_answered ?? 0) + (actualAnswerId ? 1 : 0),
                            questions_correct: (result?.[key]?.[value]?.questions_correct ?? 0) + (currectAnswerId === actualAnswerId ? 1 : 0),
                        }

                    });

                })

                // console.log(result);

                return result;


            }, scoring);

            // scoring function
            if (results?.summary?.test?.score_result && session?.config?.scoring) {

                const { type } = session?.config?.scoring;

                switch (type) {
                    case 'normal_distribution':
                        const { mean, sd } = session?.config?.scoring;
                        const score = results?.summary?.test?.score_result;
                        if (sd === 0) return;

                        const z = (score - mean) / sd;
                        const [iq_mean, iq_sd] = [100, 15];
                        const iq_score = Math.round(z < 0 ? Math.max(iq_mean + (z * iq_sd), 0) : Math.min(iq_mean + (z * iq_sd), 200));
                        const percentile = cdf[iq_score];
                        
                        // assign score to results object
                        results.summary.results = { score: iq_score, percentile };

                        break;

                    default:
                        break;

                }

            }


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