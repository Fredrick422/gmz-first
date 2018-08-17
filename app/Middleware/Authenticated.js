'use strict'

const Env = use('Env')
const ACCOUNTS_URL = Env.get('ACCOUNTS_URL')

class Authenticated {
  async handle ({ request, auth, response }, next) {
    
    try {

      await auth.check()

      return response.route(ACCOUNTS_URL)

    } catch (error) {

      await next()

    }
  
  }
}

module.exports = Authenticated
