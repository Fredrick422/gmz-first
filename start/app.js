'use strict'

const path = require('path')

/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/framework/providers/ViewProvider',
  '@adonisjs/lucid/providers/LucidProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  '@adonisjs/shield/providers/ShieldProvider',
  '@adonisjs/session/providers/SessionProvider',
  '@adonisjs/auth/providers/AuthProvider',
  '@adonisjs/mail/providers/MailProvider',
  '@adonisjs/validator/providers/ValidatorProvider',
  '@adonisjs/antl/providers/AntlProvider',
  '@adonisjs/ally/providers/AllyProvider',
  '@adonisjs/lucid-slugify/providers/SlugifyProvider',
  '@adonisjs/drive/providers/DriveProvider',
  '@adonisjs/websocket/providers/WsProvider',
   path.join(__dirname, '..', 'providers', 'socketio/provider')
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
  '@adonisjs/lucid/providers/MigrationsProvider'
]

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = []


const  locales = {
    /*
    |--------------------------------------------------------------------------
    | Loader
    |--------------------------------------------------------------------------
    |
    | The loader to be used for loading locale strings. The inbuilt loaders
    | are `file` and `database`.
    |
    */
    loader: 'file',

    /*
    |--------------------------------------------------------------------------
    | Locale
    |--------------------------------------------------------------------------
    |
    | The default locale to be used when unable to detect the user locale.
    | Or if user locale is not supported.
    |
    */
    locale: 'en'
  }

module.exports = {
  providers,
  aceProviders,
  aliases,
  commands,
  locales
}

