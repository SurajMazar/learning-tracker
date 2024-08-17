import { Exception } from '@adonisjs/core/exceptions'

export default class InvalidCredentialException extends Exception {
  static status = 401
}
