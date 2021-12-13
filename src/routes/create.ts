import { Request, Response } from 'express'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import { todoTableName } from '../constants'
import { unexpectedError, validateRequestJson } from '../util'

const dynamo = new AWS.DynamoDB.DocumentClient()
const requestSchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      minLength: 3
    }
  },
  required: ['text'],
  additionalProperties: false
}

/**
 * Handler for POST `/v1/todo` endpoint.
 * @param {Request} request Express request object.
 * @param {Response} response Express response object.
 * @returns {Promise<void>}
 */
export default async function(request: Request, response: Response): Promise<void> {
  const { body } = request
  if(!validateRequestJson(body, response, requestSchema)) {
    return
  }
  const { text } = request.body
  const id = uuidv4()
  const item = { id, text }
  const params = {
    TableName: todoTableName,
    Item: item
  }
  try {
    await dynamo.put(params).promise()
  } catch(error) {
    console.log(error)
    return unexpectedError(response)
  }
  response.status(201).json({ id, text })
}
