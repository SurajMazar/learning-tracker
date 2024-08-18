import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne, afterDelete } from '@adonisjs/lucid/orm'
import CourseContent from '#models/course_content'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import Media from '#models/media'
import { MediaTypeConstant } from '../constants/media_type.constant.js'
import MorphsConstant from '../constants/morphs.constant.js'

export default class Video extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare course_content_id: number

  @belongsTo(() => CourseContent, {
    localKey: 'id',
    foreignKey: 'course_content_id',
  })
  declare course_content: BelongsTo<typeof CourseContent>

  @hasOne(() => Media, {
    localKey: 'id',
    foreignKey: 'module_id',
    onQuery(query) {
      query
        .where('type', MediaTypeConstant.COURSE_CONTENT_VIDEO)
        .where('module_type', MorphsConstant.VIDEO)
    },
  })
  declare video_file: HasOne<typeof Media>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @afterDelete()
  static async afterDelete(model: Video) {
    await model?.video_file?.delete()
  }
}
