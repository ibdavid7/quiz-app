
// import { S3Client, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import * as AWS from "@aws-sdk/client-s3";

// const s3 = new AWS.S3({ region: "us-east-1" });



// export const handler = async (event, context, callback) => {

//   const bucket = event.Records[0].s3.bucket.name;
//   const prefix = event.Records[0].s3.object.key.split("/")[0];

//   const s3 = new AWS.S3();

// const objects = await listObjectsRecursively(bucket, prefix);

// console.log(objects);

// return objects;


//   const resp = await s3.listObjectsV2({
//     Bucket: bucket,
//     Prefix: prefix,
//   });

//   const objects = resp.Contents;

//   if (resp.CommonPrefixes) {
//     for (const prefix of resp.CommonPrefixes) {
//       const objectsRecursive = await listObjectsRecursively(event, context);
//       objects.push(...objectsRecursive);
//     }
//   }

//   return objects;

/////////////



//   const objects = await listObjectsRecursively(bucket, prefix);

//   console.log(objects);


// };


import { S3Client, ListObjectsCommand, ListObjectsV2Command, PutObjectTaggingCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({ region: "us-east-1" });



// private/us-east-1:541fd686-0298-4ad6-be07-26ff3279cc44/gg69b4a9-47e7-4e74-bf51-8c9bd9d08aaa/2bc9332290c36fb8d3ab103cb507f43f9993d67e.jpg

export const handler = async (event, context) => {

    const uuid = context.awsRequestId;
    const path_parameter = event.pathParameters['testId'];
    const userId = event.requestContext.authorizer.claims.sub;
    console.log('authorizer claims', event.requestContext.authorizer.claims)
    const { tag } = JSON.parse(event.body);



    const bucket = "quizlet-app";
    const prefix = `/private/us-east-1:${userId}/${path_parameter}/`;
    const tag = false;

    const params = {
        Bucket: bucket,
        Prefix: prefix,
        EncodingType: "url",
    };

    try {
        const data = await s3Client.send(new ListObjectsV2Command(params));

        // console.log("Success", data);

        await Promise.all(data["Contents"]
            .filter((o) => Number(o["Size"]) > 0)
            .map(async (o) => {
                // console.log(o["Key"])
                const response = await setS3ObjectTag(bucket, o["Key"], tag);
                // return response;
            })
        );


        // return data;

    } catch (err) {

        console.log("Error", err);
        throw err;
    }
};


// const listObjectsRecursively = async (bucket, prefix) => {
//   const params = {
//     Bucket: bucket,
//     Prefix: prefix,
//   };

//   const resp = await s3.listObjectsV2(params);

//   const objects = resp.Contents;
//   console.log(objects);

//   if (resp.CommonPrefixes) {
//     for (const prefix of resp.CommonPrefixes) {
//       const objectsRecursive = await listObjectsRecursively(bucket, prefix.Prefix);
//       objects.push(...objectsRecursive);
//     }
//   }

//   return objects;
// };


// const { S3Client, PutObjectTaggingCommand } = require("@aws-sdk/client-s3");

// const s3Client = new S3Client({ region: "REGION" });

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
        console.log("key:", key);
        const data = await s3Client.send(new PutObjectTaggingCommand(params));
        // console.log("Success", data);

        return data;
    } catch (err) {
        console.log("Error", err);
        throw err;
    }
}

// exports.handler = async (event) => {
//   const params = {
//     Bucket: "BUCKET_NAME",
//     Key: "OBJECT_KEY",
//     Tagging: {
//       TagSet: [
//         {
//           Key: "FLAG_NAME",
//           Value: "FLAG_VALUE",
//         },
//       ],
//     },
//   };

//   try {
//     const data = await s3Client.send(new PutObjectTaggingCommand(params));
//     console.log("Success", data);
//     return data;
//   } catch (err) {
//     console.log("Error", err);
//     throw err;
//   }
// };
