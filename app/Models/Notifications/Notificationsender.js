'use strict'

const Model = use('Model')

class Notificationsender extends Model {
    user() {
      return this.belongsTo('App/Models/User', 'sender_id', 'id')
    } 
    notification() {
       return this.belongsTo('App/Models/Notifications/Notification')
    }
}

module.exports = Notificationsender
