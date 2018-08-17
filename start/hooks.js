'use-strict'

const {hooks} = require('@adonisjs/ignitor')

hooks.after.providersBooted(()=>{
    const fs = require('fs')
    const View = use('View')
    const Env = use('Env')
    const Helpers = use('Helpers')
    const Exception = use('Exception')
    const Validator = use('Validator')
    const APP_URL = Env.get('APP_URL')
    const APP_HTTP = Env.get('APP_HTTP')

    //app url hook
    View.global('appurl', path => {

        return path ? APP_URL+'/'+path : APP_URL

    })

    //subdomain url
    View.global('subdomainUrl', (subdomain, path) => {
        const HOST = Env.get('HOST')
        const PORT = Env.get('PORT')
        const DOMAIN = APP_HTTP + subdomain + '.' + HOST + ':' + PORT
        return path ? DOMAIN + '/' + path : DOMAIN
    })

    //profile pic url
    View.global('profilepic', (userid) => {

        const defaultPath = '/uploads/profilePics/default/'
        const profPicPath = '/uploads/profilePics/' + userid +'/'
        const isExist = fs.existsSync(Helpers.publicPath(profPicPath))
        const filePath = isExist ? profPicPath : defaultPath 
        const profilepicture = fs.readdirSync(Helpers.publicPath(filePath))

        if (profilepicture[0]) {
            return filePath + profilepicture[0]
        }

        return ''

    })

    //handle invalid session exception
    Exception.handle('InvalidSessionException', (error, {response}) => {
        return response.redirect(APP_URL)

    })

    //Validation rule, check if string has sunstring
    const hasString = async (data, message, args, get) => {
        const string = data.a_name
        if (!string) {
            return
        }

        var substring = get[0]

        if (substring == '" "' || substring == "' '") {
            substring = " "
        }
        
        const include = string.includes(substring)

        if (include) {
            message = 'Name contains spaces.'
            throw message
        }
    }
    Validator.extend('hasString', hasString)
    
})