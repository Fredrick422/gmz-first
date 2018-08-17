'use strict'

const Schema = use('Schema')

class NotificationmenuSchema extends Schema {
  up () {
    this.create('notificationmenus', (table) => {
      table.increments()
      table.timestamps()
      table.integer('notification_id').unsigned().references('id').inTable('notifications').onDelete('cascade')
      table.integer('menu_id').unsigned().references('id').inTable('menus').onDelete('cascade')
    })
  }

  down () {
    this.drop('notificationmenus')
  }
}

module.exports = NotificationmenuSchema
