import { BaseResource } from './base.resource.js'
import Course from '#models/course'
import { MediaResource } from './media.resource.js'
import { UserResource } from './user.resource.js'

export class CourseResource extends BaseResource<Course> {
  async formatter(data: Course) {
    return {
      id: data?.id,
      title: data?.title,
      slug: data?.slug,
      description: data?.description,
      ...(data?.user
        ? {
            owner: await new UserResource().setData(data?.user).serialize(),
          }
        : {}),
      ...(data?.thumbnail
        ? {
            thumbnail: await new MediaResource().setData(data?.thumbnail).serialize(),
          }
        : {}),
    }
  }
}
