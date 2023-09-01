const AWS = require('aws-sdk')
const secretsManager = new AWS.SecretsManager()

exports.handler = async (event) => {
  let secret
  try {
    const response = await secretsManager
      .getSecretValue({ SecretId: 'ADMIN_SECRET' })
      .promise()
    secret = response.SecretString
  } catch (error) {
    console.error(`Failed to retrieve secret: ${error}`)
    throw 'Unauthorized' // Reject the request
  }

  const token = event.authorizationToken
  if (token === secret) {
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn,
          },
        ],
      },
    }
  } else {
    throw 'Unauthorized' // Reject the request
  }
}
