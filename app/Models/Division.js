'use strict'

const Model = use('Model')

class Division extends Model {
    account() {
      return this.belongsTo('App/Models/Account')
    }
    agents() {
      return this.hasMany('App/Models/Agent')
    }
}

module.exports = Division
