import { Exception } from '@adonisjs/core/exceptions'

export default class UnAuthenticatedException extends Exception {
  static status = 401
}
