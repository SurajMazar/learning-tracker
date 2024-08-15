/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/api/auth.controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    /**
     * AUTHENTICATION ROUTES
     */
    router.post('/register', (ctx) => {
      return new AuthController().register(ctx)
    })

    router.post('/login', (ctx) => {
      return new AuthController().login(ctx)
    })
  })
  .prefix('api')
