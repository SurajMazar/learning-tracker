import { BaseSchema } from '@adonisjs/lucid/schema'
import DatabaseConstant from '../../app/constants/database.constant.js'

export default class extends BaseSchema {
  protected tableName = 'videos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.text('description').nullable()
      table.integer('course_content_id').notNullable()
      table
        .foreign('course_content_id')
        .references(`${DatabaseConstant.COURSE_CONTENT}.id`)
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
