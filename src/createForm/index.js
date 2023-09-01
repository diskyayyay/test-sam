const AWS = require('aws-sdk')
var dynamodb = new AWS.DynamoDB()

exports.handler = async (message) => {
  console.log(message)
  if (!message.body) {
    console.log('No body')
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({}),
    }
  }

  const body = JSON.parse(message.body)

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      formId: { S: body.formId },
      phoneNumber: { S: 'NONE' },
      detail: { S: body.detail },
    },
  }

  await dynamodb.putItem(params).promise()
  console.log('Successfully created form')
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({}),
  }
}
