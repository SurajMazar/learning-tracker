import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, hasOne, scope } from '@adonisjs/lucid/orm'
import Media from '#models/media'
import type { BelongsTo, HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import MorphsConstant from '../constants/morphs.constant.js'
import User from '#models/user'
import { MediaTypeConstant } from '../constants/media_type.constant.js'
import CourseContent from '#models/course_content'

export default class Course extends BaseModel {
  static search = scope((query, keyword: string | null) => {
    if (keyword) {
      query.where('title', 'like', `%${keyword}%`)
    }
  })

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare description: string | null

  @column()
  declare userId: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasOne(() => Media, {
    localKey: 'id',
    foreignKey: 'module_id',
    onQuery(query) {
      query
        .where('type', MediaTypeConstant.COURSE_THUMBNAIL)
        .where('module_type', MorphsConstant.COURSE)
    },
  })
  declare thumbnail: HasOne<typeof Media>

  @hasMany(() => CourseContent, {
    localKey: 'id',
    foreignKey: 'course_id',
  })
  declare courseContents: HasMany<typeof CourseContent>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
