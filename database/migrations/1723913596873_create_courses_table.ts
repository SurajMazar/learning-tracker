import { BaseSchema } from '@adonisjs/lucid/schema'
import DatabaseConstant from '../../app/constants/database.constant.js'

export default class extends BaseSchema {
  protected tableName = DatabaseConstant.COURSES

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id')
      table.foreign('user_id').references(`${DatabaseConstant.USERS}.id`).onDelete('CASCADE')
      table.string('title')
      table.string('slug').unique()
      table.string('description').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
