import { BaseResource } from './base.resource.js'
import { MediaResource } from './media.resource.js'
import Video from '#models/video'

export class VideoResource extends BaseResource<Video> {
  async formatter(data: Video) {
    return {
      id: data?.id,
      title: data?.title,
      course_content_id: data?.course_content_id,
      description: data?.description,
      ...(data?.video_file
        ? {
            video_file: await new MediaResource().setData(data?.video_file).serialize(),
          }
        : {}),
    }
  }
}
