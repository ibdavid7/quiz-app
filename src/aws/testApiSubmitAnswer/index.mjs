import { TEST_SESSIONS_TABLE, updateItem, } from "./utils.mjs";


const [ANSWERS, RESUME_QUESTION_INDEX] = ['answers', 'resume_question_index'];

export const handler = async (event, context, callback) => {

  const uuid = context.awsRequestId;
  const path_parameter = event.pathParameters['sessionId'];
  const { questionId, optionId, questionIndex } = JSON.parse(event.body);
  // TODO update with authentication

  const params = {
    TableName: TEST_SESSIONS_TABLE,
    Key: {
      id: path_parameter,
    },
    UpdateExpression: 'SET #map.#nested_map = :new_value, #item_attribute = :new_value2',
    ExpressionAttributeNames: {
      '#map': ANSWERS,
      '#nested_map': questionId,
      '#item_attribute': RESUME_QUESTION_INDEX,

    },
    ExpressionAttributeValues: {
      ':new_value': optionId,
      ':new_value2': questionIndex,
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
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: `Error retrieving item: ${err}` })
    };
  }

};