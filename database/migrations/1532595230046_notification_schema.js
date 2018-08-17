'use strict'

const Schema = use('Schema')

class NotificationSchema extends Schema {
  up () {
    this.create('notifications', (table) => {
      table.increments()
      table.timestamps()
      table.boolean('n_sender').defaultTo(false)
      table.integer('recipient_id').unsigned().references('id').inTable('users').onDelete('cascade')
      table.integer('type_id').unsigned().references('id').inTable('notificationtypes').onDelete('cascade')
      table.boolean('n_seen').defaultTo(false)
      table.string('n_url', 50)
      table.boolean('n_urgent').defaultTo(false)
      table.boolean('n_deleted').defaultTo(false)
    })
  }

  down () {
    this.drop('notifications')
  }
}

module.exports = NotificationSchema
