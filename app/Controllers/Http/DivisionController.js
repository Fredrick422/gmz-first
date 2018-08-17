'use strict'

const {
  validateAll
} = use('Validator')

const Division = use('App/Models/Division')
const Account = use('App/Models/Account')
const Agent = use('App/Models/Agent')
const AuthorizationService = use('App/Services/AuthorizationService')
const CurrentService = use('App/Services/CurrentService')

class DivisionController {

    //GET METHOD. Show a list of all the divisions
    async index({ view, params, response}) {
        const {a_id} = params
        const account = await Account.find(a_id)
        const rDivisions = await account.divisions().fetch()
        const divisions =rDivisions.toJSON()

        return view.render('accounts/partials/division/all', {
           divisions
        })
    }

    //GET METHOD Render a form to be used for creating a new user
    create({view, response, request}){

        return view.render('accounts.partials.division.add')
    }
    
    //POST METHOS Create/save a new user.
    async store({auth,request,response, session}) {
        try {

            const values = request.all()

            //validate form inputs
            const rules = {
                d_name: 'required'
            }
            const messages = {
                'd_name.required': 'Division name is required.'
            }
            const validation = await validateAll(values, rules, messages)

            if (validation.fails()) {
                var withErrors = validation.messages()
                return response.json(withErrors)
            }

            const division = new Division()
            const user = await auth.getUser()
            const company = await user.company().fetch()
            const account = await CurrentService.account(auth, session)

            AuthorizationService.verifyPermisssion(account.company_id, company.id)

            const saveto = await Account.find(account.id)

            division.fill({
                d_name: values.d_name,
                d_setup_complete: true
            })
            
            await saveto.divisions().save(division)

            return response.json({
                completed: true,
                step: 'divisions',
                id: division.id
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

    //GET METHOD. Display a single user
    show({auth,response,view,session}) {
        
    }

    //GET METHOD. Render a form to update an existing user.
    async edit({view, response, params}){
         
        const {id} = params
        const rDivision = await Division.find(id)
        const division = rDivision.toJSON()
        

        return view.render('accounts.partials.division.edit', {
           division
        })

    }
    
    //PUT/PATCH METHOD. Update division details.
    async update({auth,request,response, params}) {
        try {
            const values = request.all()

            //validate form inputs
            const rules = {
              d_name: 'required'
            }
            const messages = {
              'd_name.required': 'Division name is required.'
            }

            const validation = await validateAll(values, rules, messages)

            if (validation.fails()) {
                var withErrors = validation.messages()
                return response.json(withErrors)
            }

            //const user = await auth.getUser()
            //const company = await user.company().fetch()
            const {id} = params
            const division = await Division.find(id)

            //AuthorizationService.verifyPermisssion(account.company_id, company.id)

            division.merge({
                d_name: values.d_name
            })
            
            await division.save()

            return response.json({
                completed: true,
                step: 'divisions',
                id: params.id
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


    //DELETE METHODE. Delete a division with id.
    async destroy({params, response}){

        try {
            const {id} = params
            const division = await Division.find(id)

            await division.delete()
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
}

module.exports = DivisionController
