'use strict'

/*
|--------------------------------------------------------------------------
| NotificationtypeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Factory = use('Factory')

class NotificationtypeSeeder {
  async run () {
     await Factory.model('App/Models/Notificationtype').createMany(1)
  }
}

module.exports = NotificationtypeSeeder
