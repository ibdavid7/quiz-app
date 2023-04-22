import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, sanitizeSessionQuestions, sanitizeSession, queryTable, updateItem, putItem } from "./utils.mjs";


const [ANSWER, ANSWERS] = ['answer', 'answers'];

export const handler = async (event, context, callback) => {

    const [INSERT, REMOVE, MODIFY] = ['INSERT', 'REMOVE', 'MODIFY'];

    // const uuid = context.awsRequestId;

    const promises = event.Records.map(async (record) => {

        // console.log(record);
        // console.log(record.dynamodb);
        // console.log(record.dynamodb.NewImage);
        // console.log(record.dynamodb.OldImage);

        const { eventName } = record;
        // console.log(eventName);


        let params, testId, rating;

        //, stats.score = (stats.totalScore + :total) / (stats.ratings + :increment) 
        // , stats.totalScore = stats.totalScore + :total
        // , ":total": Number(rating) 

        switch (eventName) {
            case INSERT:

                testId = record.dynamodb.NewImage.testId.S;
                rating = record.dynamodb.NewImage.rating.N;

                params = {
                    TableName: TEST_TABLE,
                    Key: { id: testId },
                    UpdateExpression: "SET stats.ratings = stats.ratings + :increment, stats.totalScore = stats.totalScore + :rating",
                    ExpressionAttributeValues: { ":increment": 1, ":rating": Number(rating) }
                };
                break;

            case REMOVE:

                testId = record.dynamodb.OldImage.testId.S;
                rating = record.dynamodb.OldImage.rating.N;
                // console.log(testId, rating);
                params = {
                    TableName: TEST_TABLE,
                    Key: { id: testId },
                    UpdateExpression: "SET stats.ratings = stats.ratings + :increment, stats.totalScore = stats.totalScore + :rating",
                    ExpressionAttributeValues: { ":increment": -1, ":rating": -Number(rating) }
                };
                break;

            case MODIFY:

                testId = record.dynamodb.OldImage.testId.S;
                const oldRating = record.dynamodb.OldImage.rating.N;
                const newRating = record.dynamodb.NewImage.rating.N;
                rating = Number(newRating) - Number(oldRating);
                params = {
                    TableName: TEST_TABLE,
                    Key: { id: testId },
                    UpdateExpression: "SET stats.totalScore = stats.totalScore + :rating",
                    ExpressionAttributeValues: { ":rating": rating }
                };
                break;

            default:
                return;
        }

        try {

            let res = await updateItem(params);

            // console.log(res);


        } catch (err) {
            console.log(err);
        }

    });

    await Promise.all(promises);
};