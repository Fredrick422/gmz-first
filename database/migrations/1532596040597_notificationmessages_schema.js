'use strict'

const Schema = use('Schema')

class NotificationmessagesSchema extends Schema {
  up () {
    this.create('notificationmessages', (table) => {
      table.increments()
      table.timestamps()
      table.integer('notification_id').unsigned().references('id').inTable('notifications').onDelete('cascade')
      table.string('n_title', 20)
      table.string('n_message', 255)
    })
  }

  down () {
    this.drop('notificationmessages')
  }
}

module.exports = NotificationmessagesSchema
