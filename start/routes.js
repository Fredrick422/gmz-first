'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')
const Helpers = use('Helpers')
const edge = use('edge.js')
const Env = use('Env')
const DOMAIN = Env.get('HOST')
const ACCOUNTS_DOMAIN = 'accounts.' + DOMAIN
const ACCOUT_DOMAIN = ':account.' + DOMAIN
const CHAT_API_DOMAIN = 'chat.' + DOMAIN


edge.registerViews(Helpers.viewsPath())

Route.get('logout', 'AuthController.logout')
Route.get('login', 'AuthController.loginform')
Route.post('login', 'AuthController.login')
Route.get('register', 'AuthController.registerform')
Route.post('register', 'AuthController.register')
Route.get('register/confirm/:token', 'AuthController.confrim').middleware(['authenticated'])
//Route.get('password/reset', 'AuthController.showResetRequestForm').middleware(['authenticated'])
Route.get('password/reset/:token', 'AuthController.resetform').middleware(['authenticated'])
Route.post('password/reset', 'AuthController.reset')
Route.post('password/email', 'AuthController.resetlink')

//register new route groups for notifications
Route.group(() => {

    Route.get('notifications/list', 'NotificationController.list')
    Route.get('notifications/listall', 'NotificationController.listall')
    Route
        .resource('notifications', 'NotificationController')
        .except(['create', 'edit', ])

}).middleware(['auth', 'GlobalServices'])

//Register routes for public domain
Route.group(() => {
  Route.on('/').render('public/pages/home').as('home')
}).domain(DOMAIN)

//Register Agents Routes
Route.group(() => {
    Route
      .resource('agents', 'AgentController')
      .except(['create'])
      .middleware(['auth'])

    Route.get('agents/create/:divisionid', 'AgentController.create').middleware(['auth'])
    Route.post('agents/resend/invite/:id', 'AgentController.resend').middleware(['auth'])
    Route.put('agents/:id/profile/upload', 'AgentController.profilepic')
    Route.get('agents/confirm/:token', 'AgentController.confirm')
})


Route.group(() => {
    Route.get('/', 'CompanyController.dashboard').middleware(['AccountWizzard'])
    Route
        .resource('company', 'CompanyController')
        .except(['show'])

    Route.get('/settings', 'CompanyController.show').middleware(['AccountWizzard'])
    //account routes
    Route.get('/account/customize', 'AccountController.customize')
    Route.post('/account/current/:id', 'AccountController.setcurrent')
    Route.post('/account/validate/:id', 'AccountController.validate')
    Route 
        .resource('account', 'AccountController')
        .except(['create', 'edit'])

    //division routes
    Route
        .resource('divisions', 'DivisionController')
        .except(['index'])

    Route.post('divisions/:a_id', 'DivisionController.index')

})
.domain(ACCOUNTS_DOMAIN)
.middleware(['auth', 'GlobalServices'])

Route.group(() => {
    Route.get('/', 'AccountController.home')
    Route
        .resource('chat', 'Chat/ChatController')
})
.domain(ACCOUT_DOMAIN)
.middleware(['auth', 'GlobalServices'])

Route.group(() => {
    Route
        .resource('api', 'Chat/ApiController')
        .only('create')

})
.domain(CHAT_API_DOMAIN)











