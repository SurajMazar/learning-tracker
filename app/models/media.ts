import { DateTime } from 'luxon'
import { BaseModel, column, afterDelete } from '@adonisjs/lucid/orm'
import databaseConstant from '../constants/database.constant.js'
import drive from '@adonisjs/drive/services/main'
import env from '#start/env'

export default class Media extends BaseModel {
  static table = databaseConstant.MEDIA

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare module_type: string

  @column()
  declare module_id: number

  @column()
  declare type: string

  @column()
  declare mime_type: string | null

  @column()
  declare file_url: string

  @column()
  declare size: string | null

  @column()
  declare metadata: any

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  async getFormattedUrl(): Promise<string> {
    return drive.use(env.get('DRIVE_DISK')).getUrl(this.file_url)
  }

  @afterDelete()
  static async afterDelete(model: Media) {
    if (model?.file_url) {
      await drive.use().delete(model?.file_url)
    }
  }
}
