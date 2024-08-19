import { cuid } from '@adonisjs/core/helpers'
import Media from '#models/media'
import { TransactionClientContract } from '@adonisjs/lucid/types/database'

export class MediaService {
  async uploadFile(
    file: any,
    path: string,
    moduleType: string,
    moduleId: number,
    mediaType: string,
    trx: undefined | TransactionClientContract = undefined
  ) {
    if (!file) return null
    const fullPath = `${path}/${cuid()}.${file.extname}`
    /** STORE THE FILE IN MINIO */
    await file.moveToDisk(fullPath, 'minio')
    /** CREATES A MEDIA AND RETURN*/
    return await Media.create(
      {
        file_url: fullPath,
        mime_type: `${file?.type}/${file?.subtype}`,
        size: file?.size,
        module_id: moduleId,
        module_type: moduleType,
        type: mediaType,
      },
      {
        ...(trx
          ? {
              client: trx,
            }
          : {}),
      }
    )
  }

  /**
   *
   * @param media
   * @param trx
   */
  async deleteMedia(media: Media, trx: undefined | TransactionClientContract = undefined) {
    if (trx) {
      media = media.useTransaction(trx)
    }
    await media.delete()
  }

  /**
   *
   * @param mediaId
   * @param trx
   */
  async deleteMediaById(mediaId: number, trx: undefined | TransactionClientContract = undefined) {
    const media = await Media.query(trx ? { client: trx } : {})
      .where('id', mediaId)
      .firstOrFail()
    await media.delete()
  }
}
