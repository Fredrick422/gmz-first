'use strict'

const Schema = use('Schema')

class AgentSchema extends Schema {
  up () {
    this.create('agents', (table) => {
      table.increments()
      table.timestamps()
      table.integer('division_id').unsigned().references('id').inTable('divisions').onDelete('cascade')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('a_username', 80)
      table.string('a_firstname', 50)
      table.string('a_lastname', 50)
      table.string('a_phone', 20)
      table.integer('a_role', 10)
      table.string('a_confirmation_token', 255).notNullable().unique().index()
      table.boolean('a_setup_complete').defaultTo(false)
    })
  }

  down () {
    this.drop('agents')
  }
}

module.exports = AgentSchema
