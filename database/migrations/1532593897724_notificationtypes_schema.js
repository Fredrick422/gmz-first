'use strict'

const Schema = use('Schema')

class NotificationtypesSchema extends Schema {
  up () {
    this.create('notificationtypes', (table) => {
      table.increments()
      table.timestamps()
      table.string('n_name', 25)
      table.string('n_icon', 25)
    })
  }

  down () {
    this.drop('notificationtypes')
  }
}

module.exports = NotificationtypesSchema
