'use strict'

const Model = use('Model')

class Notification extends Model {
    user() {
      return this.belongsTo('App/Models/User', 'recipient_id', 'id') 
    }

    type() {
      return this.belongsTo('App/Models/Notifications/Notificationtype', 'type_id', 'id')
    }

    menu() {
      return this.belongsTo('App/Models/Notifications/Notificationmenu')
    }

    message(){
      return this.hasOne('App/Models/Notifications/Notificationmessage')
    }

    sender() {
      return this.hasOne('App/Models/Notifications/Notificationsender')
    }
}

module.exports = Notification
