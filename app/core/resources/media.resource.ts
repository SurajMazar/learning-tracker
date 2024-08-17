import { BaseResource } from './base.resource.js'
import Media from '#models/media'
import drive from '@adonisjs/drive/services/main'
import env from '#start/env'

export class MediaResource extends BaseResource<Media> {
  async formatter(data: Media) {
    return {
      id: data?.id,
      mime_type: data?.mime_type,
      file_url: data?.file_url
        ? this.formatUrl(await drive.use(env.get('DRIVE_DISK')).getUrl(data?.file_url))
        : null,
      size: data?.size,
    }
  }

  formatUrl(url: string) {
    return url.replace(/^https?:\/\/[^/]+/, env.get('MINIO_URL'))
  }
}
