import { BaseSchema } from '@adonisjs/lucid/schema'
import DatabaseConstant from '../../app/constants/database.constant.js'

export default class extends BaseSchema {
  protected tableName = DatabaseConstant.COURSE_CONTENT

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid').unique().notNullable()
      table.integer('course_id').notNullable()
      table.foreign('course_id').references(`${DatabaseConstant.COURSES}.id`).onDelete('CASCADE')
      table.integer('parent_id')
      table
        .foreign('parent_id')
        .references(`${DatabaseConstant.COURSE_CONTENT}.id`)
        .onDelete('CASCADE')
      table.string('title').notNullable()
      table.text('description').nullable()
      table.jsonb('metadata').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
