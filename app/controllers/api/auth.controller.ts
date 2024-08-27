import type { HttpContext } from '@adonisjs/core/http'
import RegisterValidator from '#validators/auth/register'
import { successResponse } from '../../core/utils/response.utils.js'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import LoginValidator from '#validators/auth/login'
import InvalidCredentialException from '#exceptions/invalid_credential_exception'
import MessageConstant from '../../constants/message.constant.js'

export default class AuthController {
  /**
   *
   * @param ctx
   */
  async register(ctx: HttpContext) {
    const data = ctx.request.all()
    const payload = await RegisterValidator.validate(data)
    await User.create({
      ...payload,
      fullName: `${payload?.first_name} ${payload.last_name}`,
    })
    return successResponse(ctx, 'User registered successfully.')
  }

  /**
   *
   * @param ctx
   */
  async login(ctx: HttpContext) {
    const data = ctx.request.all()
    const payload = await LoginValidator.validate(data)

    const user = await User.query().where('email', payload?.email).first()
    if (user) {
      const valid = await hash.verify(user.password, payload.password)
      if (valid) {
        const token = await this.createToken(user)
        return successResponse(ctx, 'Login success.', {
          user,
          token,
        })
      }
    }
    throw new InvalidCredentialException(MessageConstant.INVALID_CREDENTIALS)
  }

  async authUser(ctx: HttpContext) {
    const authUser = ctx?.auth?.getUserOrFail()
    return successResponse(ctx, 'Auth user..', authUser)
  }

  /**
   * CREATE AUTH TOKEN
   * @param user
   * @protected
   */
  protected async createToken(user: User) {
    const token = await User.accessTokens.create(user)
    return token.value!.release()
  }
}
