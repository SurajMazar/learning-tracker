import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import Media from '#models/media'
import { MediaTypeConstant } from '../constants/media_type.constant.js'
import MorphsConstant from '../constants/morphs.constant.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Video from '#models/video'
import Course from '#models/course'

export default class CourseContent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare uuid: string

  @column()
  declare course_id: number

  @column()
  declare parent_id: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare metadata: any

  @belongsTo(() => Course, {
    localKey: 'course_id',
    foreignKey: 'id',
  })
  declare course: BelongsTo<typeof Course>

  @hasMany(() => Video, {
    localKey: 'id',
    foreignKey: 'course_content_id',
  })
  declare videos: HasMany<typeof Video>

  @hasMany(() => Media, {
    localKey: 'id',
    foreignKey: 'module_id',
    onQuery(query) {
      query
        .where('type', MediaTypeConstant.COURSE_CONTENT_DOCUMENT)
        .where('module_type', MorphsConstant.COURSE_CONTENT)
    },
  })
  declare files: HasMany<typeof Media>

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
