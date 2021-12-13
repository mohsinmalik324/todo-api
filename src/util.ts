import { Response } from 'express'
import { validate } from 'jsonschema'

/**
 * Returns the error response.
 * @param {Response} response The express response object.
 * @param {string[]} errors Errors to return to client.
 * @param {number} httpCode HTTP status code to return. Defaults to `400`.
 * @returns {void}
 */
export function errorResponse(response: Response, errors: string[], httpCode=400): void {
  response.status(httpCode).json({ errors })
}

/**
 * Validates the json body of the given request.
 * @param {Record<string, unknown>} body The json body of the incoming request.
 * @param {Response} response The express response object. This function sets the response on validation failure.
 * @param {Record<string, unknown>} requestSchema The schema to validate against.
 * @returns {boolean} true if validation passed, otherwise false.
 */
export function validateRequestJson(
  body: Record<string, unknown>,
  response: Response,
  requestSchema: Record<string, unknown>
): boolean {
  const result = validate(body, requestSchema)
  if(result.valid) {
    return true
  }
  const errors = result.errors.map(error => error.toString().replace('instance', 'request'))
  errorResponse(response, errors)
  return false
}

/**
 * Sets the response as unexpected error.
 * @param {Response} response The express response object.
 * @returns {void}
 */
export function unexpectedError(response: Response): void {
  errorResponse(response, ['An unexpected error occured'], 500)
}
