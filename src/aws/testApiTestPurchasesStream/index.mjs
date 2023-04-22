import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, sanitizeSessionQuestions, sanitizeSession, queryTable, updateItem, putItem } from "./utils.mjs";


const [ANSWER, ANSWERS] = ['answer', 'answers'];

export const handler = async (event, context, callback) => {

    // const uuid = context.awsRequestId;

    // console.log(event.Records[0].dynamodb.NewImage.testId.S);

    const testId = event.Records[0].dynamodb.NewImage.testId.S;

    try {

        const params = {
            TableName: TEST_TABLE,
            Key: { id: testId },
            UpdateExpression: "SET stats.sales = stats.sales + :increment",
            ExpressionAttributeValues: { ":increment": 1 }
        };

        let res = await updateItem(params);

        // console.log(res);


    } catch (err) {
        console.log(err);
    }

};