'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const Factory = use('Factory')
const Hash = use('Hash')
const RandomString = require('random-string')

Factory.blueprint('App/Models/User', async (faker) => {
  return {
    u_email: 'admin@gumzo.io',
    u_password: await Hash.make('6A$2N3F2gfw*WJ5q'),
    u_is_active: true,
    u_role: 1,
    u_confirmation_token: RandomString({
      length: 40
    })
  }
})

Factory.blueprint('App/Models/Notificationtype', async (faker) => {
  return {
    n_name: 'setting',
    n_icon: 'ti-settings'
  }
})
