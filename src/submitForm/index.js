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

  //check if formId and phoneNumber is in database
  //if not, return 400
  const isFormIdSubmitted = dynamodb.getItem({
    TableName: process.env.TABLE_NAME,
    Key: {
      formId: { S: body.formId },
      phoneNumber: { S: body.phoneNumber },
    },
  })
  if (isFormIdSubmitted)
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        message: 'FormId and phoneNumber already submitted',
      }),
    }

  const formSubmitted = dynamodb.query({
    TableName: process.env.TABLE_NAME,
    IndexName: process.env.INDEX_NAME,
    KeyConditionExpression:
      'formId = :formIdValue AND phoneNumber = :phoneValue',
    ExpressionAttributeValues: {
      ':formIdValue': { S: body.formId },
      ':phoneValue': { S: body.phoneNumber },
    },
  })

  const body = JSON.parse(message.body)

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      formId: { S: body.formId },
      phoneNumber: { S: body.phoneNumber },
      detail: { S: body.detail },
    },
  }

  await dynamodb.putItem(params).promise()
  console.log('Successfully created form')
  const count = formSubmitted.Count + 1

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      achieveQuest: count == process.env.QUEST_COUNT ? true : false,
      message: 'Successfully created form',
    }),
  }
}
