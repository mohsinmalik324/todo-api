import { Request, Response } from 'express'
import AWS from 'aws-sdk'
import { todoTableName } from '../constants'
import { unexpectedError, errorResponse } from '../util'

const dynamo = new AWS.DynamoDB.DocumentClient()

/**
 * Handler for GET `/v1/todo` endpoint.
 * @param {Request} request Express request object.
 * @param {Response} response Express response object.
 * @returns {Promise<void>}
 */
export default async function(request: Request, response: Response): Promise<void> {
  const { id } = request.query
  let responseJson: any
  if(!id) {
    let dynamoResponse
    try {
      const params = {
        TableName: todoTableName
      }
      dynamoResponse = await dynamo.scan(params).promise()
    } catch(error) {
      console.log(error)
      return unexpectedError(response)
    }
    responseJson = { todos: dynamoResponse.Items }
  } else {
    const params = {
      TableName: todoTableName,
      Key: { id }
    }
    let dynamoResponse
    try {
      dynamoResponse = await dynamo.get(params).promise()
    } catch(error) {
      console.log(error)
      return unexpectedError(response)
    }
    if(!dynamoResponse || !('Item' in dynamoResponse)) {
      return errorResponse(response, ['Item not found'], 404)
    }
    responseJson = dynamoResponse.Item
  }
  response.status(200).json(responseJson)
}
