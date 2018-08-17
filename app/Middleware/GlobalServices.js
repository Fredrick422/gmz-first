'use strict'
const GlobalService = use('App/Services/GlobalService')
const NotificationService = use('App/Services/NotificationService')

class Services {
  async handle ({ request, auth}, next) { 

    const Company = {
      company: await GlobalService.company(auth),
      isCompany: await GlobalService.isCompany(auth)
    } 

    const Account = {
      accounts: await GlobalService.accounts(auth),
      count: await GlobalService.accountCount(auth)
    }

    const Divisions = {
      division: await GlobalService.division(auth)
    }

    const Notifications = {
      badge: await NotificationService.badge(auth),
      count: await NotificationService.badgecount(auth)
    }

    
    request.helpers = {
      Company,
      Account,
      Divisions,
      Notifications
    }
  
    // call next to advance the request
    await next()
  }
}

module.exports = Services
