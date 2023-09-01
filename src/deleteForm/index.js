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

  const isFormIdExist = dynamodb.getItem({
    TableName: process.env.TABLE_NAME,
    Key: {
      formId: { S: body.formId },
      phoneNumber: { S: 'NONE' },
    },
  })

  if (!isFormIdExist)
    return {
      statusCode: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        message: 'FormId not found',
      }),
    }

  const body = JSON.parse(message.body)

  await dynamodb
    .deleteItem({
      TableName: process.env.TABLE_NAME,
      Key: {
        formId: { S: body.formId },
        phoneNumber: { S: 'NONE' },
      },
    })
    .promise()
  console.log('Update successfull')
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({}),
  }
}
