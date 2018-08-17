'use strict'

const {
  validateAll
} = use('Validator')

const HTTP = use('request')
const Cheerio = use('cheerio')
const Env = use('Env')
const APP_URL = Env.get('APP_URL')
const RandomString = require('random-string')
const Account = use('App/Models/Account')
const AuthorizationService = use('App/Services/AuthorizationService')

class AccountController {

    //GET METHOD. Show a list of all the users
    async index({ view, auth, subdomains}) {
        
    }

    //GET METHOD Render a form to be used for creating a new user
    create({view}){
        return view.render('accounts.pages.account-new')
    }
    
    //POST METHOS Create/save a new account.
    async store({auth,request,response}){
        try {
            const account = new Account()
            const user = await auth.getUser()
            const company = await user.company().fetch()
            const values = request.all()

            //validate form inputs
            const rules = {
                a_name: 'required',
                a_website_url: 'required|url'
            }
            const messages = {
                'a_name.required': 'Website Name is required.',
                'a_website_url.required': 'Website URL is required',
                'a_website_url.url': 'Website URL must be a valid url'
            }

            const validation = await validateAll(values, rules, messages)

            if (validation.fails()) {
                var withErrors = validation.messages()
                return response.json(withErrors)
            }

            const key = RandomString({length:15})

            account.fill({
                a_name: values.a_name,
                a_website_url: values.a_website_url,
                a_key: key.toUpperCase(),
                a_validation_token: RandomString({
                  length: 40 
                }),
                a_setup_complete: true
            })
            
            await company.accounts().save(account)

            return response.json({
                completed: true,
                step: 'account',
                id: account.id
            })

        } catch (error) {
            return response.json({
                alert: {
                    type: 'info',
                    title: 'Internal Error!',
                    message: 'Please try again later.',
                    ButtonText: 'Ok'
                }
            })
        }
    }

    //GET METHOD. Display a single account
    show({auth,response,view,session}) {
      
    }

    //GET METHOD. Display a home page for account login
    async home({auth,response,view,session, subdomains}) {
        
        try {
            const accounts = await Account.findBy('a_slug', subdomains.account)
            const account = accounts.toJSON()

            //verify auth
            try {
                await auth.check()

                return view.render('accounts.pages.agents.dashboard', {
                    subdomains,
                    account
                })

            } catch (error) {
                //show login form
                return view.render('auth.login', {
                    title: subdomains.account,
                    account
                })
            }

        } catch (error) {
            session.flash({
                    alert : {
                        type: 'error',
                        title: 'Account does not exist!',
                        showCancelButton: false,
                        message: 'Check your account domain then try again!!!',
                        confirmButtonText: 'Ok!',
                    }
                })
                
            return response.redirect(APP_URL)
        }
        
    } 

    //GET METHOD. Render a form to update an existing account.
    async edit({view, params}){
        const agent = await Agent.find(params.id).then(res => {return res.toJSON()})
        return view.render('accounts.pages.agent.edit', {
           agent
        })
    }
    
    //PUT/PATCH METHOD. Update account details.
    async update({auth,request,response, params}){
        try {
            const user = await auth.getUser()
            const {id} = params
            const account = await Account.find(id)
            const company = await user.company().fetch()
            const values = request.all()

            //validate form inputs
            const rules = {
                a_name: 'required',
                a_website_url: 'required|url'
            }
            const messages = {
                'a_name.required': 'Website Name is required.',
                'a_website_url.required': 'Website URL is required',
                'a_website_url.url': 'Website URL must be a url'
            }

            const validation = await validateAll(values, rules, messages)

            if (validation.fails()) {
                var withErrors = validation.messages()
                return response.json(withErrors)
            }
            AuthorizationService.verifyPermisssion(account.company_id, company.id)
            account.merge({
                a_name: values.a_name,
                a_website_url: values.a_website_url
            })

            await account.save()

            return response.json({
                completed: true,
                step: 'account',
                id: id
            })
        } catch (error) {
            return response.json({
                alert: {
                    type: 'info',
                    title: 'Internal Error!',
                    message: 'Please try again later.',
                    ButtonText: 'Ok'
                }
            })
        }
    }

    //DELETE METHODE. Delete account with id.
    async destroy({auth, request, response, params}){
        try {
            const user = await auth.getUser()
            const {id} = params
            const account = await Account.find(id)
            const company = await user.company().fetch()
            AuthorizationService.verifyPermisssion(account.company_id, company.id)
            account.delete()
            return response.json({
              completed: true
            })
        } catch (error) {
            return response.json({
              alert: {
                    type: 'info',
                    title: 'Internal Error!',
                    message: 'Please try again later.',
                    ButtonText: 'Ok'
                }
            })
        }
        
    }

    //POST Method validate current account
    async validate({params, session,response}){
        const {id} = params
        const account = await Account.find(id)
        const validation_token = account.a_validation_token
        const website_url = account.a_website_url

        const promise = new Promise((resolve, reject) => {
            HTTP.get(website_url, (error, res, body) => {

                if (error) reject(error);
                /*if (res.statusCode != 200) {
                    reject('Invalid status code <' + res.statusCode + '>');
                }*/
                resolve(body);
            });
        });

        try {
            const metadata = await promise
            const $ = Cheerio.load(metadata)
            const token = $('meta[name=gmz-account-validation]').attr('content')

            if (token) {

                if (validation_token === token) {

                    try {
                        account.merge({
                            a_validated: true,
                        })

                        await account.save()

                        return response.json({
                            completed: true
                        })

                    } catch (error) {
                        return response.json({
                            alert: {
                                type: 'error',
                                title: 'Internal Error',
                                message: 'Please try  again later!!!',
                                ButtonText: 'Ok!'
                            }
                        })
                    }
                
                }
                
                return response.json({
                    alert: {
                        type: 'error',
                        title: 'Invalid Token!',
                        message: 'Use the validation token for this account!!!',
                        ButtonText: 'Ok!'
                    }
                })
            }

            return response.json({
                alert: {
                    type: 'error',
                    title: 'Token Not Found!',
                    message: 'We did not find your token, Please follow the steps again to validate your account!!!',
                    ButtonText: 'Ok!'
                }
            })

        } catch (error) {
            if (error.code == 'ENOTFOUND') {
                return response.json({
                    alert: {
                        type: 'error',
                        title: 'Not Found!',
                        message: 'URL was not found!',
                        ButtonText: 'Ok!'
                    }
                })
            }
        }

    }

    //POST Method for setting current account
    async setcurrent({params, response, session}){
        try {
            const {id} = params

            session.put('AccountId', id)

            return response.json({
               completed: true
            })

        } catch (error) {
            return response.json({
              alert: {
                    type: 'info',
                    title: 'Internal Error!',
                    message: 'Please try again later.',
                    ButtonText: 'Ok'
                }
            })
        }
    }

    //GET customize account
    customize({view}){
        return view.render('accounts.pages.customize')
    }
}

module.exports = AccountController