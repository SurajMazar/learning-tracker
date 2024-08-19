import { MediaService } from '#services/media.service'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'
import Video from '#models/video'
import { MediaPathConstant } from '../constants/media_path.constant.js'
import MorphsConstant from '../constants/morphs.constant.js'
import { MediaTypeConstant } from '../constants/media_type.constant.js'

export class VideoService {
  protected mediaService: MediaService

  constructor() {
    this.mediaService = new MediaService()
  }

  async store(data: Record<string, any>, trx: undefined | TransactionClientContract = undefined) {
    const video = await Video.create(
      {
        title: data?.title,
        description: data?.description,
        course_content_id: data?.course_content?.id,
      },
      trx ? { client: trx } : {}
    )
    if (data?.video_file) {
      await this.mediaService.uploadFile(
        data?.video_file,
        `${MediaPathConstant.COURSE_CONTENT_VIDEO_PATH}/${data?.course_content?.uuid}`,
        MorphsConstant.VIDEO,
        video?.id,
        MediaTypeConstant.COURSE_CONTENT_VIDEO,
        trx
      )
    }
    await video.load('video_file')
    await video.load('course_content')
    return video
  }

  async update(
    videoId: number,
    data: Record<string, any>,
    trx: undefined | TransactionClientContract = undefined
  ) {
    const existing = await Video.query(trx ? { client: trx } : {})
      .where('id', videoId)
      .preload('video_file')
      .firstOrFail()
    if (existing) {
      existing.title = data?.title
      existing.description = data?.description
      existing.course_content_id = data?.course_content_id
      if (data?.video_file) {
        if (existing?.video_file) {
          await this.mediaService.deleteMedia(existing?.video_file)
        }
        await this.mediaService.uploadFile(
          data?.video_file,
          `${MediaPathConstant.COURSE_CONTENT_VIDEO_PATH}/${data?.course_content?.uuid}`,
          MorphsConstant.VIDEO,
          existing?.id,
          MediaTypeConstant.COURSE_CONTENT_VIDEO,
          trx
        )
      }
      await existing.save()
      await existing.load('video_file')
      return existing
    }
    return await this.store(data, trx)
  }

  async delete(videoId: number, trx: undefined | TransactionClientContract = undefined) {
    const existing = await Video.query(trx ? { client: trx } : {})
      .preload('video_file')
      .where('id', videoId)
      .firstOrFail()
    await existing.delete()
  }
}
