'use strict'

const Schema = use('Schema')

class NotificationbadgeSchema extends Schema {
  up () {
    this.create('notificationbadges', (table) => {
      table.increments()
      table.timestamps()
      table.integer('recipient_id').unsigned().references('id').inTable('users').onDelete('cascade')
      table.boolean('new_in').defaultTo(false)
      table.integer('n_count').defaultTo(0)
    })
  }

  down () {
    this.drop('notificationbadges')
  }
}

module.exports = NotificationbadgeSchema
