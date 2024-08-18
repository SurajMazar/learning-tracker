import { BaseSchema } from '@adonisjs/lucid/schema'
import DatabaseConstant from '../../app/constants/database.constant.js'

export default class extends BaseSchema {
  protected tableName = DatabaseConstant.MEDIA

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('module_type').notNullable()
      table.integer('module_id').notNullable()
      table.string('mime_type').nullable()
      table.string('file_url').notNullable()
      table.string('size').nullable()
      table.string('metadata').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
