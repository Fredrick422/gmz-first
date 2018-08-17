'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments()
      table.string('u_email', 254).notNullable().unique() 
      table.text('u_password', 'longtext').notNullable()
      table.boolean('u_is_active').defaultTo(false)
      table.integer('u_role', 10).notNullable()
      table.string('u_confirmation_token', 255).notNullable().unique().index()
      table.timestamps()
    })

  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
