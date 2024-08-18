import db from '@adonisjs/lucid/services/db'
import Course from '#models/course'
import string from '@adonisjs/core/helpers/string'
import MorphsConstant from '../constants/morphs.constant.js'
import { MediaService } from '#services/media.service'
import { cuid } from '@adonisjs/core/helpers'
import { PER_PAGE } from '#config/app'
import { MediaTypeConstant } from '../constants/media_type.constant.js'
import { MediaPathConstant } from '../constants/media_path.constant.js'

export class CourseService {
  protected mediaService: MediaService
  constructor() {
    this.mediaService = new MediaService()
  }

  /**
   *
   * @param keyword
   * @param page
   */
  async index(keyword: string | null = null, page: number = 1) {
    return Course.query()
      .preload('user')
      .preload('thumbnail')
      .withScopes((scope) => {
        scope.search(keyword)
      })
      .orderBy('created_at', 'desc')
      .paginate(page, PER_PAGE)
  }

  /**
   * @param data
   */
  async store(data: Record<string, any>) {
    const trx = await db.transaction()
    try {
      const course = await Course.create(
        {
          title: data?.title,
          slug: await this.generateCourseSlug(string.slug(data?.title).toLowerCase()),
          description: data?.description,
          userId: data?.userId,
        },
        { client: trx }
      )
      await this.mediaService.uploadFile(
        data?.thumbnail,
        MediaPathConstant.COURSE_THUMBNAIL_PATH,
        MorphsConstant.COURSE,
        course?.id,
        MediaTypeConstant.COURSE_THUMBNAIL,
        trx
      )
      await trx.commit()
      await course.load('thumbnail')
      await course.load('user')
      return course
    } catch (exception) {
      await trx.rollback()
      throw exception
    }
  }

  async update(slug: string, data: Record<string, any>) {
    const trx = await db.transaction()
    try {
      const course = await Course.query({ client: trx })
        .preload('thumbnail')
        .preload('user')
        .where('slug', slug)
        .firstOrFail()
      const newSlug =
        course?.title !== data?.title
          ? await this.generateCourseSlug(string.slug(data?.title).toLowerCase())
          : slug

      course.title = data?.title
      course.slug = newSlug
      course.description = data?.description
      await course.save()

      if (data?.thumbnail) {
        /* DELETING THE OLD THUMBNAIL */
        if (course?.thumbnail) {
          await this.mediaService.deleteMedia(course?.thumbnail, trx)
        }
        /* UPLOADING NEW THUMBNAIL */
        await this.mediaService.uploadFile(
          data?.thumbnail,
          MediaPathConstant.COURSE_THUMBNAIL_PATH,
          MorphsConstant.COURSE,
          course?.id,
          MediaTypeConstant.COURSE_THUMBNAIL,
          trx
        )
      }
      await trx.commit()
      await course.load('thumbnail')
      return course
    } catch (exception) {
      await trx.rollback()
      throw exception
    }
  }

  async show(course_id: number) {
    return await Course.query()
      .where('id', '=', course_id)
      .preload('thumbnail')
      .preload('user')
      .firstOrFail()
  }

  async generateCourseSlug(slug: string) {
    const existing = await Course.query().where('slug', slug).first()
    return existing ? `${slug}-${cuid()}` : slug
  }
}
