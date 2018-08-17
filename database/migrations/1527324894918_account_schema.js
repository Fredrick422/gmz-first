'use strict'

const Schema = use('Schema')

class AccountSchema extends Schema {
  up () {
    this.create('accounts', (table) => {
      table.increments()
      table.timestamps()
      table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('cascade')
      table.string('a_name', 140).notNullable().unique().index()
      table.string('a_website_url', 120).notNullable()
      table.boolean('a_type').defaultTo(false)
      table.integer('a_status', 2) 
      table.boolean('a_validated').defaultTo(false)
      table.string('a_key', 255).notNullable().unique().index()
      table.string('a_validation_token', 255).notNullable().unique().index()
      table.string('a_access_token', 255)
      table.string('a_slug', 80).notNullable()
      table.boolean('a_setup_complete').defaultTo(false)
    })
  }

  down () {
    this.drop('accounts')
  }
}

module.exports = AccountSchema