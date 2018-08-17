'use strict'

const Model = use('Model')

class Notificationbadge extends Model {
    static boot() {
      super.boot()

      /**
       * A hook to increment new in count notifications before update
       * it to the database.
       */
      this.addHook('beforeUpdate', async (instance) => {
        if (instance.new_in) {
          instance.n_count = instance.n_count+1
        }else{
          instance.n_count = instance.n_count - 1
        }
      })
    }

    user() {
      return this.belongsTo('App/Models/User', 'recipient_id', 'id')
    }
}

module.exports = Notificationbadge
