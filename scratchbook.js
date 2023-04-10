const s3Url = 'https://quizlet-app.s3.amazonaws.com/tests/gg69b4a9-47e7-4e74-bf51-8c9bd9d08nef/instructions_image.png';
const s3UrlParts = s3Url.split('/');
console.log(s3UrlParts);
const bucket = s3UrlParts[2].split('.')[0];
const key = s3UrlParts.slice(3).join('/');

console.log(`Bucket: ${bucket}`);
console.log(`Object Key: ${key}`);