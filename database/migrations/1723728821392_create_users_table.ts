import { BaseSchema } from '@adonisjs/lucid/schema'
import DatabaseConstant from '../../app/constants/database.constant.js'

export default class extends BaseSchema {
  protected tableName = DatabaseConstant.USERS

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('full_name').nullable()
      table.string('email', 254).notNullable().unique()
      table.string('username').unique()
      table.string('password').notNullable()
      table.jsonb('contact').nullable()
      table.text('description').nullable()
      table.boolean('status').defaultTo(true)
      table.jsonb('metadata').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
