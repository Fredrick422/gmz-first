'use strict'

const Schema = use('Schema')

class DivisionSchema extends Schema {
  up () {
    this.create('divisions', (table) => {
      table.increments()
      table.timestamps()
      table.integer('account_id').unsigned().references('id').inTable('accounts').onDelete('cascade')
      table.string('d_name', 80).notNullable()
      table.boolean('d_setup_complete').defaultTo(false)
    })
  }

  down () {
    this.drop('divisions')
  }
}

module.exports = DivisionSchema
