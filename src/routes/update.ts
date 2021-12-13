import { Request, Response } from 'express'
import AWS from 'aws-sdk'
import { validateRequestJson, unexpectedError, errorResponse } from '../util'
import { todoTableName } from '../constants'

const dynamo = new AWS.DynamoDB.DocumentClient()
const requestSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    text: {
      type: 'string'
    }
  },
  required: ['id', 'text'],
  additionalProperties: false
}

/**
 * Handler for PATCH `/v1/todo` endpoint.
 * @param {Request} request Express request object.
 * @param {Response} response Express response object.
 * @returns {Promise<void>}
 */
export default async function(request: Request, response: Response): Promise<void> {
  const { body } = request
  if(!validateRequestJson(body, response, requestSchema)) {
    return
  }
  const { id, text } = body
  let dynamoResponse
  try {
    const params = {
      TableName: todoTableName,
      Key: { id }
    }
    dynamoResponse = await dynamo.get(params).promise()
  } catch(error) {
    console.log(error)
    return unexpectedError(response)
  }
  if(!dynamoResponse || !('Item' in dynamoResponse)) {
    return errorResponse(response, ['Item not found'], 404)
  }
  try {
    const params = {
      TableName: todoTableName,
      Item: { id, text }
    }
    await dynamo.put(params).promise()
  } catch(error) {
    console.log(error)
    return unexpectedError(response)
  }
  response.status(200).json({ id, text })
}
