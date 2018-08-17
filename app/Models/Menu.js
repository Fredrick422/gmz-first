'use strict'

const Model = use('Model')

class Menu extends Model {
    static boot() {
      super.boot()
      this.addTrait('@provider:Lucid/Slugify', {
        fields: {
          m_slug: 'm_name'
        },
        strategy: 'dbIncrement',
        disableUpdates: false
      })
    }

    notifications() {
      return this.hasMany('App/Models/Notifications/Notificationmenu')
    }
}

module.exports = Menu
