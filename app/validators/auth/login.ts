import vine from '@vinejs/vine'

const LoginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)

export default LoginValidator
