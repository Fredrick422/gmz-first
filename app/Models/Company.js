'use strict'

const Model = use('Model')

class Company extends Model {
    user() {
      return this.belongsTo('App/Models/User')
    }
    accounts() {
      return this.hasMany('App/Models/Account')
    }
}

module.exports = Company
