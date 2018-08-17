'use strict'

const Schema = use('Schema')

class CompanySchema extends Schema {
  up () {
    this.create('companies', (table) => {
      table.increments()
      table.timestamps()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('cascade')
      table.string('c_name', 80).notNullable()
      table.string('c_country', 50)
      table.string('c_region', 50)
      table.string('c_city', 50)
      table.string('c_phone', 20)
      table.string('c_zip', 20)
      table.string('c_address', 20)
      table.boolean('c_setup_complete').defaultTo(false)
    })

  }

  down () {
    this.drop('companies')
  }
}

module.exports = CompanySchema
