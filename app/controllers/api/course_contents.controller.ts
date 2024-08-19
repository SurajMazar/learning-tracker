import type { HttpContext } from '@adonisjs/core/http'
import { CourseContentService } from '#services/course_content.service'
import { successResponse } from '../../core/utils/response.utils.js'
import { CourseContentResource } from '../../core/resources/course_content.resource.js'
import { PaginationResource } from '../../core/resources/pagination.resource.js'
import { CreateCourseContentRequest } from '#validators/course_content/create_course_content'
import { UpdateCourseContentRequest } from '#validators/course_content/update_course_content'
import { AddFileCourseContentRequest } from '#validators/course_content/add_file_course_content'

export default class CourseContentsController {
  protected courseContentService: CourseContentService

  constructor() {
    this.courseContentService = new CourseContentService()
  }

  async index(ctx: HttpContext) {
    const courseContents = await this.courseContentService.list(ctx?.params?.course_id)
    return successResponse(
      ctx,
      'Course contents.',
      await new CourseContentResource().setData(courseContents.all()).serialize(),
      await new PaginationResource().setData(courseContents, true).serialize()
    )
  }

  async store(ctx: HttpContext) {
    const payload = await CreateCourseContentRequest.validate(ctx.request.all())
    const courseContent = await this.courseContentService.store({
      ...payload,
      files: ctx.request.files('files'),
    })
    return successResponse(
      ctx,
      'Course content created.',
      await new CourseContentResource().setData(courseContent).serialize()
    )
  }

  async update(ctx: HttpContext) {
    const payload = await UpdateCourseContentRequest.validate(ctx.request.all())
    const courseContent = await this.courseContentService.update(ctx.params.course_content_id, {
      ...payload,
    })
    return successResponse(
      ctx,
      'Course content created.',
      await new CourseContentResource().setData(courseContent).serialize()
    )
  }

  async addFiles(ctx: HttpContext) {
    await AddFileCourseContentRequest.validate(ctx.request.allFiles())
    await this.courseContentService.addFile(
      ctx.params.course_content_id,
      ctx.request.files('files')
    )
    return successResponse(ctx, 'Files added in the course content.')
  }

  async deleteFile(ctx: HttpContext) {
    await this.courseContentService.deleteFile(ctx.params.file_id)
    return successResponse(ctx, 'File deleted')
  }
}
