import type { HttpContext } from '@adonisjs/core/http'
import CourseCreateValidator from '#validators/course/course_create'
import { successResponse } from '../../core/utils/response.utils.js'
import { CourseService } from '#services/course.service'
import { CourseResource } from '../../core/resources/course.resource.js'
import CourseUpdateValidator from '#validators/course/course_update'
import { PaginationResource } from '../../core/resources/pagination.resource.js'

export default class CoursesController {
  protected courseService: CourseService

  constructor() {
    this.courseService = new CourseService()
  }

  async index(ctx: HttpContext) {
    const courses = await this.courseService.index(ctx?.request?.qs()?.keyword ?? null)

    return successResponse(
      ctx,
      'Courses List.',
      await new CourseResource().setData(courses?.all()).serialize(),
      await new PaginationResource().setData(courses, true).serialize()
    )
  }

  /**
   *
   * @param ctx
   */
  async show(ctx: HttpContext) {
    const course = await this.courseService.show(ctx?.request?.params()?.course_id ?? null)

    return successResponse(
      ctx,
      'Courses details.',
      await new CourseResource().setData(course).serialize()
    )
  }

  /**
   *
   * @param ctx
   */
  async create(ctx: HttpContext) {
    const payload = await CourseCreateValidator.validate(ctx.request.all())
    const authUser = ctx?.auth?.getUserOrFail()
    const course = await this.courseService.store({
      ...payload,
      thumbnail: ctx.request.file('thumbnail'),
      userId: authUser?.id,
    })

    return successResponse(
      ctx,
      'Course created.',
      await new CourseResource().setData(course).serialize()
    )
  }

  /**
   *
   * @param ctx
   */
  async update(ctx: HttpContext) {
    const payload = await CourseUpdateValidator.validate(ctx.request.all())
    const course = await this.courseService.update(ctx?.params?.slug, {
      ...payload,
      thumbnail: ctx.request.file('thumbnail'),
    })

    return successResponse(
      ctx,
      'Course updated.',
      await new CourseResource().setData(course).serialize()
    )
  }
}
