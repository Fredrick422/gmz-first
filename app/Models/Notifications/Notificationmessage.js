'use strict'

const Model = use('Model')

class Notificationmessage extends Model {
    notification() {
        return this.belongsTo('App/Models/Notifications/Notification')
    }
}

module.exports = Notificationmessage
