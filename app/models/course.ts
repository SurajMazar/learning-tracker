import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasOne, scope } from '@adonisjs/lucid/orm'
import Media from '#models/media'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import MorphsConstant from '../constants/morphs.constant.js'
import User from '#models/user'

export default class Course extends BaseModel {
  static search = scope((query, keyword: string | null) => {
    if (keyword) {
      query.where('publishedOn', 'like', `%${keyword}%`)
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
      query.where('module_type', MorphsConstant.COURSE)
    },
  })
  declare thumbnail: HasOne<typeof Media>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
