'use strict'

const Hash = use('Hash')
const Model = use('Model')

class User extends Model { 
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeCreate', async (userInstance) => {
      if (userInstance.u_password) {
         userInstance.u_password = await Hash.make(userInstance.u_password)
      }
    })

    this.addHook('beforeUpdate', async (userInstance) => {
      if (userInstance.u_password) {
        userInstance.u_password = await Hash.make(userInstance.u_password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  company() {
    return this.hasOne('App/Models/Company')
  }

  agent() {
    return this.hasOne('App/Models/Agent')
  }

  notifications() {
    return this.hasMany('App/Models/Notifications/Notification', 'id', 'recipient_id')
  }

  notificationbadge() {
    return this.hasOne('App/Models/Notifications/Notificationbadge', 'id', 'recipient_id')
  }

  notificationsender() {
    return this.hasMany('App/Models/Notifications/Notificationsender', 'id', 'sender_id')
  }
}

module.exports = User