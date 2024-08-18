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
import CoursesController from '#controllers/api/courses.controller'
import { middleware } from '#start/kernel'

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

    /**
     * COURSES RELATED
     */
    router
      .group(() => {
        router.get('/', (ctx) => {
          return new CoursesController().index(ctx)
        })
        router.post('/create', (ctx) => {
          return new CoursesController().create(ctx)
        })
        router.patch('/:slug/update', (ctx) => {
          return new CoursesController().update(ctx)
        })
      })
      .prefix('/courses')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .prefix('api')
