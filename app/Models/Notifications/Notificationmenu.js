'use strict'

const Model = use('Model')

class Notificationmenu extends Model {
    menu() {
      return this.belongsTo('App/Models/Menu')
    }
}

module.exports = Notificationmenu
