import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, sanitizeSessionQuestions, sanitizeSession, queryTable, updateItem, putItem } from "./utils.mjs";


const [ANSWER, ANSWERS] = ['answer', 'answers'];

export const handler = async (event, context, callback) => {

  const uuid = context.awsRequestId;
  const path_parameter = event.pathParameters['sessionId'];
  const { questionId, optionId } = JSON.parse(event.body);
  // TODO update with authentication

  const params = {
    TableName: TEST_SESSIONS_TABLE,
    Key: {
      id: path_parameter,
    },
    UpdateExpression: 'SET #map.#nested_map = :new_value',
    ExpressionAttributeNames: {
      '#map': ANSWERS,
      '#nested_map': questionId,
    },
    ExpressionAttributeValues: {
      ':new_value': optionId,
    }
  }

  try {

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

};