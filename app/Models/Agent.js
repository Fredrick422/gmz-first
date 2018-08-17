'use strict'

const Model = use('Model')

class Agent extends Model {
    division() {
        return this.belongsTo('App/Models/Division')
    }
    user() {
      return this.belongsTo('App/Models/User')
    }
}

module.exports = Agent
