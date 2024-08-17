import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'

export const successResponse = (
  ctx: HttpContext,
  message: string,
  data: any = undefined,
  meta: any = undefined,
  code: number = 200
) => {
  const formattedData: any = {
    success: true,
    message: message,
  }
  if (data) {
    formattedData['data'] = data
  }
  if (meta) {
    formattedData['meta'] = meta
  }

  return ctx.response.status(code).json(formattedData)
}

export const failureResponse = (
  ctx: HttpContext,
  exception: any,
  message: string,
  errors: any = undefined,
  code: number = 400
) => {
  /**
   * SAVING THE EXCEPTION IN LOGGER
   */
  logger.error(exception)

  /**
   * DATA PREPARATION
   */
  const formattedData: any = {
    success: false,
    message: message,
  }

  if (errors) {
    formattedData['errors'] = errors
  }

  /**
   * DISPLAY THE ISSUE IF IN DEVELOPMENT
   */
  if (app.inDev) {
    formattedData['debug'] = exception
  }

  return ctx.response.status(code).json(formattedData)
}
