import vine from '@vinejs/vine'
import DatabaseConstant from '../../constants/database.constant.js'

const RegisterValidator = vine.compile(
  vine.object({
    first_name: vine.string().maxLength(255),
    last_name: vine.string().maxLength(255),
    email: vine.string().unique(async (db, value) => {
      const user = await db.from(DatabaseConstant.USERS).where('email', value).first()
      return !user
    }),
    username: vine.string().unique(async (db, value) => {
      const user = await db.from(DatabaseConstant.USERS).where('username', value).first()
      return !user
    }),
    password: vine.string().minLength(8),
  })
)

export default RegisterValidator
