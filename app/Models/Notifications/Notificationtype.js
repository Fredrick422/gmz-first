'use strict'

const Model = use('Model')

class Notificationtype extends Model {
    notification() {
      return this.hasOne('App/Models/Notifications/Notification', 'id', 'type_id')
    }
}

module.exports = Notificationtype
