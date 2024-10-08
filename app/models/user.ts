import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '7 days',
  })
  @column({ isPrimary: true })
  declare id: number
  @column()
  declare firstName: string | null
  @column()
  declare lastName: string | null
  @column()
  declare fullName: string | null
  @column()
  declare email: string
  @column()
  declare username: string
  @column({ serializeAs: null })
  declare password: string
  @column()
  declare description: string | null
  @column()
  declare status: boolean
  @column()
  declare contact: any
  @column()
  declare metadata: any
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
