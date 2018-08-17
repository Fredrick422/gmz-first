'use strict'

const Model = use('Model')

class Token extends Model {
    user() {
        return this.belognsTo('App/Models/User')
    }
}

module.exports = Token
