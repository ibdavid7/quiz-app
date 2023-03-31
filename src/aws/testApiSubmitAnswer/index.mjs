import { ddbDocClient, TEST_TABLE, TEST_SESSIONS_TABLE, getItems, getItem, sanitizeSessionQuestions, sanitizeSession, queryTable, updateItem } from "./utils.mjs";

export const handler = async (event, context, callback) => {

  const uuid = context.awsRequestId;
  const path_parameter = event.pathParameters['sessionId'];
  const { questionId, optionId } = JSON.parse(event.body);
  // TODO update with authentication
  // const userId = 'userId2';

  const params = {
    TableName: TEST_SESSIONS_TABLE,
    Key: {
      id: path_parameter,
    },
    UpdateExpression: 'SET #map.#nested_map = :new_value',
    ExpressionAttributeNames: {
      '#map': 'answers',
      '#nested_map': questionId,
      // '#attribute': 'answer'
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




