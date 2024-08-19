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
import CourseContentsController from '#controllers/api/course_contents.controller'
import CourseContentVideoController from '#controllers/api/video.controller'

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

    /**
     * COURSE CONTENT
     */
    router
      .group(() => {
        router.get('/:course_id', (ctx) => {
          return new CourseContentsController().index(ctx)
        })
        router.post('/create', (ctx) => {
          return new CourseContentsController().store(ctx)
        })
        router.patch('/:course_content_id/update', (ctx) => {
          return new CourseContentsController().update(ctx)
        })

        /**
         * COURSE CONTENT FILE
         */
        router.post('/:course_content_id/files', (ctx) => {
          return new CourseContentsController().addFiles(ctx)
        })

        router.delete('/file/:file_id', (ctx) => {
          return new CourseContentsController().deleteFile(ctx)
        })

        /**
         * COURSE CONTENT VIDEO
         */
        router.post('/:course_content_id/video', (ctx) => {
          return new CourseContentVideoController().store(ctx)
        })
        router.patch('/:course_content_id/video/:video_id', (ctx) => {
          return new CourseContentVideoController().update(ctx)
        })
        router.delete('/video/:video_id', (ctx) => {
          return new CourseContentVideoController().delete(ctx)
        })
      })
      .prefix('/course-contents')
      .use(
        middleware.auth({
          guards: ['api'],
        })
      )
  })
  .prefix('api')
