import {
    TEST_TABLE, TEST_SESSIONS_TABLE, TEST_PURCHASES_TABLE,
    getItems, getItem, putItem, queryTable,
    STARTED, COMPLETED, CANCELLED, PURCHASES_GSI
} from "./utils.mjs";

const [DRAFT, INREVIEW, APPROVED, REJECTED, PUBLISHED] = ['draft', 'in-review', 'approved', 'rejected', 'published'];

export const handler = async (event, context, callback) => {

    // const { testId } = JSON.parse(event.body);

    const userId = event.requestContext.authorizer.claims.sub;
    // console.log('userId claims: ', event.requestContext.authorizer);

    const uuid = context.awsRequestId;

    try {

        const params_put = {
            TableName: TEST_TABLE,
            Item: {
                id: uuid,
                authorId: userId,
                status: DRAFT,
                config: {
                    category: null,
                    instructions: null,
                    instructions_image: null,
                    label: null,
                    scoring: {
                        type: null,
                    },
                },
                product_card: {
                    description: null,
                    description_bullet_points: [null, null, null, null],
                    header: null,
                    image: null,
                    price: null,
                    tags: {
                        sale: null,
                        update: null,
                        category: null,
                        language: null,
                    },
                },
                product_summary: {
                    overview: null,
                },
                questions: [],
                stats: {
                    ratings: 0,
                    sales: 0,
                    totalScore: 0,
                },
            },
        };

        const putSession = await putItem(params_put);

        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ testId: uuid }),
        };
        return response;

    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ message: 'Error creating item. ' + err })
        };
    }

};