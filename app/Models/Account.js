'use strict'

const Model = use('Model')

class Account extends Model {
    static boot() {
      super.boot()
      this.addTrait('@provider:Lucid/Slugify', {
        fields: {
          a_slug: 'a_name'
        },
        strategy: 'dbIncrement',
        disableUpdates: false
      })
    }
    company() {
      return this.belongsTo('App/Models/Company')
    }
    divisions() {
      return this.hasMany('App/Models/Division')
    }
}

module.exports = Account
