import { BaseResource } from './base.resource.js'
import CourseContent from '#models/course_content'
import { VideoResource } from './video.resource.js'
import { MediaResource } from './media.resource.js'

export class CourseContentResource extends BaseResource<CourseContent> {
  async formatter(data: CourseContent) {
    return {
      id: data?.id,
      title: data?.title,
      course_id: data?.course_id,
      description: data?.description,
      ...(data?.videos
        ? {
            videos: await new VideoResource().setData(data?.videos).serialize(),
          }
        : {}),
      ...(data?.files
        ? {
            files: await new MediaResource().setData(data?.files).serialize(),
          }
        : {}),
    }
  }
}
