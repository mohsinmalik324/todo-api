import { Request, Response } from 'express'
import AWS from 'aws-sdk'
import { todoTableName } from '../constants'
import { validateRequestJson, unexpectedError } from '../util'

const dynamo = new AWS.DynamoDB.DocumentClient()
const requestSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      minLength: 10
    }
  },
  required: ['id'],
  additionalProperties: false
}

/**
 * Handler for DELETE `/v1/todo` endpoint.
 * @param {Request} request Express request object.
 * @param {Response} response Express response object.
 * @returns {Promise<void>}
 */
export default async function(request: Request, response: Response): Promise<void> {
  const { body } = request
  if(!validateRequestJson(body, response, requestSchema)) {
    return
  }
  const { id } = body
  const params = {
    TableName: todoTableName,
    Key: { id }
  }
  try {
    await dynamo.delete(params).promise()
  } catch(error) {
    console.log(error)
    return unexpectedError(response)
  }
  response.status(200).send()
}
