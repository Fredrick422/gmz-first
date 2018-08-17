'use strict'

const {
  validateAll
} = use('Validator')


const Env = use('Env')
const EMAIL_NOREPLY = Env.get('EMAIL_NOREPLY')
const Company = use('App/Models/Company')
const Account = use('App/Models/Account')
const CurrentService = use('App/Services/CurrentService')
const Event = use('Event')

class CompanyController { 
    
    index() {

    }

    //SHOW dashboard
    async dashboard({auth,response,view,session, request}) {
        const Helpers = request.helpers
        Helpers.Account.current = await CurrentService.account(auth, session)

        /*Event.emit('new::notification', {
                n_sender: false,
                recipient_id: Helpers.Company.company.user_id,
                n_type: 'system',
                n_urgent: true,
                n_title: 'Title',
                n_message: 'Accepted your invitation',

            })*/

        return view.render('accounts.pages.dashboard', {
            Helpers
        })
    }
    
    //GET METHOD Render a form to be used for creating a new company
    async create({auth, view, response, session}) {
        //return view.render('accounts.pages.company-edit')
    }

    //POST METHOS Create/save a new company.
    async store({auth,request,response}) {
        try {
            const user = await auth.getUser()
            const values = request.all()

            //validate form inputs
            const rules = {
                c_name: 'required',
                c_country: 'required'
            }
            const messages = {
                'c_name.required': 'Company name is required.',
                'c_phone.number': 'Phone number is not valid',
                'c_country.required': 'Country is required'
            }

            const validation = await validateAll(request.all(), rules, messages)

            if (validation.fails()) {
                var withErrors = validation.messages()
                return response.json(withErrors)
            }

            const company = new Company()
            company.fill({
                c_name: values.c_name,
                c_country: ('c_country' in values) ? values.c_country : null,
                c_region: ('c_region' in values) ? values.c_region : null,
                c_city: ('c_city' in values) ? values.c_city : null,
                c_phone: ('c_phone' in values) ? values.c_phone : null,
                c_zip: ('c_zip' in values) ? values.c_zip : null,
                c_address: ('c_address' in values) ? values.c_address : null,
                c_setup_complete: true
            })

            await user.company().save(company)

            try {
                await Mail.send('company.emails.new', {}, (message) => {
                  message
                    .to(values.a_email)
                    .from(EMAIL_NOREPLY)
                    .subject('Company Created')
                })
            } catch (error) {
                
            }

            return response.json({
                completed: true,
                step: 'company',
                id: company.id
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

    //GET METHOD. Display a company
    async show({auth,response,view, session, request}) {
        const Helpers = request.helpers
        Helpers.Account.current = await CurrentService.account(auth, session)

        return view.render('accounts.pages.settings', {
            Helpers
        })
    }

    //GET METHOD. Render a form to update an existing company.
    edit() {

    }

    //PUT/PATCH METHOD. Update company details.
    async update({auth,request,response, params}) {
        try {
            const user = await auth.getUser()
            const values = request.all()

            //validate form inputs
            const rules = {
                c_name: 'required',
                c_country: 'required'
            }
            const messages = {
                'c_name.required': 'Company Name is required.',
                'c_phone.number': 'Phone number is not valid',
                'c_country.required': 'Country is required'
            }

            const validation = await validateAll(request.all(), rules, messages)
            
            if (validation.fails()) {
                var withErrors = validation.messages()
                return response.json(withErrors)
            }

            const company = new Company()
            company.fill({
                c_name: values.c_name,
                c_country: ('c_country' in values) ? values.c_country : null,
                c_region: ('c_region' in values) ? values.c_region : null,
                c_city: ('c_city' in values) ? values.c_city : null,
                c_phone: ('c_phone' in values) ? values.c_phone : null,
                c_zip: ('c_zip' in values) ? values.c_zip : null,
                c_address: ('c_address' in values) ? values.c_address : null
            })

            await user.company().update(company)

            return response.json({
                completed: true,
                step: 'company',
                id: params.id
            })

        } catch (error) {
            return response.json({
                alert: {
                    type: 'info',
                    title: 'Internal Sever Error!',
                    message: 'Please try again later.',
                    ButtonText: 'Ok!'
                }
            })
        }
    }

    
    //DELETE METHODE. Delete a company with id.
    destroy() {

    }

}

module.exports = CompanyController
