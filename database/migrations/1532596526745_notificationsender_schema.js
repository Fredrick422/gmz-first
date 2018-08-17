'use strict'

const Schema = use('Schema')

class NotificationsenderSchema extends Schema {
  up () {
    this.create('notificationsenders', (table) => {
      table.increments()
      table.timestamps()
      table.integer('notification_id').unsigned().references('id').inTable('notifications').onDelete('cascade')
      table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('cascade')
    })
  }

  down () {
    this.drop('notificationsenders')
  }
}

module.exports = NotificationsenderSchema
