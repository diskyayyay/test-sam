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

  const params = {
    TableName: process.env.TABLE_NAME,
    IndexName: process.env.INDEX_NAME,
    KeyConditionExpression: 'phoneNumber <> :phoneValue',
    ExpressionAttributeValues: {
      ':phoneValue': 'NONE',
    },
  }

  var result = await dynamodb.query(params).promise()
  console.log(`Done query: ${JSON.stringify(result)}`)

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(result.Item),
  }
}
