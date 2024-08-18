import { MediaService } from '#services/media.service'
import CourseContent from '#models/course_content'
import db from '@adonisjs/lucid/services/db'
import { MediaPathConstant } from '../constants/media_path.constant.js'
import MorphsConstant from '../constants/morphs.constant.js'
import { MediaTypeConstant } from '../constants/media_type.constant.js'
import { VideoService } from '#services/video.service'
import Course from '#models/course'
import { PER_PAGE } from '#config/app'
import { v4 } from 'uuid'

export class CourseContentService {
  protected mediaService: MediaService
  protected videoService: VideoService

  constructor() {
    this.mediaService = new MediaService()
    this.videoService = new VideoService()
  }

  async list(course_id: number, page: number = 1) {
    await Course.query().where('id', '=', course_id).firstOrFail()
    return await CourseContent.query()
      .where('course_id', course_id)
      .preload('files')
      .preload('videos', (query) => {
        query.preload('video_file')
      })
      .paginate(page, PER_PAGE)
  }

  async store(data: Record<string, any>) {
    const trx = await db.transaction()
    try {
      const courseContent = await CourseContent.create({
        uuid: v4(),
        title: data?.title,
        course_id: data?.course_id,
        description: data?.description,
      })

      if (data?.files && data?.files.length) {
        await Promise.all(
          data?.files.map(async (file: any) => {
            await this.mediaService.uploadFile(
              file,
              `${MediaPathConstant.COURSE_CONTENT_DOCUMENT_PATH}/${courseContent.uuid}`,
              MorphsConstant.COURSE_CONTENT,
              courseContent?.id,
              MediaTypeConstant.COURSE_CONTENT_DOCUMENT,
              trx
            )
          })
        )
      }

      await trx.commit()
      return courseContent
    } catch (exception) {
      await trx.rollback()
      throw exception
    }
  }

  /**
   *
   * @param courseContentId
   * @param data
   */
  async update(courseContentId: number, data: Record<string, any>) {
    const courseContent = await CourseContent.query().where('id', courseContentId).firstOrFail()
    courseContent.title = data?.title
    courseContent.course_id = data?.course_id
    courseContent.description = data?.description
    return courseContent
  }

  /**
   *
   * @param courseContentId
   */
  async show(courseContentId: number) {
    return await CourseContent.query().preload('course').where('id', courseContentId).firstOrFail()
  }

  /**
   *
   * @param courseContentId
   * @param files
   */
  async addFile(courseContentId: number, files: Array<any>) {
    const trx = await db.transaction()
    try {
      const courseContent = await CourseContent.query().where('id', courseContentId).firstOrFail()
      if (files && files.length) {
        await Promise.all(
          files.map(async (file: any) => {
            await this.mediaService.uploadFile(
              file,
              `${MediaPathConstant.COURSE_CONTENT_DOCUMENT_PATH}/${courseContent.uuid}`,
              MorphsConstant.COURSE_CONTENT,
              courseContent?.id,
              MediaTypeConstant.COURSE_CONTENT_DOCUMENT,
              trx
            )
          })
        )
      }
      await trx.commit()
      return courseContent
    } catch (exception) {
      await trx.rollback()
      throw exception
    }
  }

  /**
   *
   * @param fileId
   */
  async deleteFile(fileId: number) {
    const trx = await db.transaction()
    try {
      await this.mediaService.deleteMediaById(fileId, trx)
      await trx.commit()
    } catch (exception) {
      await trx.rollback()
      throw exception
    }
  }

  async addVideo(courseContentId: number, data: Record<string, any>) {
    const trx = await db.transaction()
    try {
      const courseContent = await CourseContent.query().where('id', courseContentId).firstOrFail()
      const video = await this.videoService.store(
        {
          title: data?.title,
          description: data?.description,
          video_file: data?.video_file,
          course_content: courseContent,
        },
        trx
      )
      await trx.commit()
      return video
    } catch (exception) {
      await trx.rollback()
      throw exception
    }
  }

  async updateVideo(courseContentId: number, videoId: number, data: Record<string, any>) {
    const trx = await db.transaction()
    try {
      const courseContent = await CourseContent.query().where('id', courseContentId).firstOrFail()
      const video = await this.videoService.update(
        videoId,
        {
          title: data?.title,
          description: data?.description,
          video_file: data?.video_file,
          course_content: courseContent,
        },
        trx
      )
      await trx.commit()
      return video
    } catch (exception) {
      await trx.rollback()
      throw exception
    }
  }
  async deleteVideo(videoId: number) {
    await this.videoService.delete(videoId)
  }
}
