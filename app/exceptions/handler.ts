import app from '@adonisjs/core/services/app'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine'
import { failureResponse } from '../core/utils/response.utils.js'
import InvalidCredentialException from '#exceptions/invalid_credential_exception'
import MessageConstant from '../constants/message.constant.js'
import { errors as AdonisAuthError } from '@adonisjs/auth'
import { errors as LucidErrors } from '@adonisjs/lucid'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return failureResponse(
        ctx,
        error,
        MessageConstant.VALIDATION_ERRORS,
        this.formatValidationError(error.messages),
        422
      )
    } else if (error instanceof InvalidCredentialException) {
      return failureResponse(ctx, error, error.message, null, error.status)
    } else if (error instanceof AdonisAuthError.E_UNAUTHORIZED_ACCESS) {
      return failureResponse(ctx, error, error?.message, null, error.status)
    } else if (error instanceof LucidErrors.E_ROW_NOT_FOUND) {
      return failureResponse(ctx, error, 'Requested data not found.', null, error.status)
    }
    return failureResponse(ctx, error, 'Something went wrong.', null, 400)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }

  /**
   *
   * @param errorMessages
   */
  formatValidationError(errorMessages: Array<any> = []) {
    if (errorMessages.length === 0) return []

    return errorMessages.reduce((acc: Record<string, Array<string>>, { field, message }) => {
      if (field) {
        acc[field] = acc[field] ? [...acc[field], message] : [message]
      }
      return acc
    }, {})
  }
}
