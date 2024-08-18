import { CourseContentService } from '#services/course_content.service'
import type { HttpContext } from '@adonisjs/core/http'
import { AddVideoCourseContentRequest } from '#validators/course_content/add_video_course_content'
import { successResponse } from '../../core/utils/response.utils.js'
import { VideoResource } from '../../core/resources/video.resource.js'
import { UpdateVideoCourseContentRequest } from '#validators/course_content/update_video_course_content'

export default class CourseContentVideoController {
  protected courseContentService: CourseContentService
  constructor() {
    this.courseContentService = new CourseContentService()
  }

  async store(ctx: HttpContext) {
    const payload = await AddVideoCourseContentRequest.validate({
      ...ctx.request.all(),
      ...ctx.request.allFiles(),
    })

    const video = await this.courseContentService.addVideo(ctx.params.course_content_id, {
      ...payload,
      video_file: ctx.request.file('video_file'),
    })

    return successResponse(
      ctx,
      'Video added.',
      await new VideoResource().setData(video).serialize()
    )
  }

  async update(ctx: HttpContext) {
    const payload = await UpdateVideoCourseContentRequest.validate({
      ...ctx.request.all(),
      ...ctx.request.allFiles(),
    })
    const video = await this.courseContentService.updateVideo(
      ctx.params.course_content_id,
      ctx.params.video_id,
      {
        ...payload,
        video_file: ctx.request.file('video_file'),
      }
    )

    return successResponse(
      ctx,
      'Video updated.',
      await new VideoResource().setData(video).serialize()
    )
  }

  async delete(ctx: HttpContext) {
    await this.courseContentService.deleteVideo(ctx.params.video_id)
    return successResponse(ctx, 'Video deleted.')
  }
}
