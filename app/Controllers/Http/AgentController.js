'use strict'

const {
  validateAll
} = use('Validator')

const Env = use('Env')

const APP_URL = Env.get('APP_URL')

const RandomString = require('random-string')

const Mail = use('Mail')

const Hash = use('Hash')

const Drive = use('Drive')

const Helpers = use('Helpers')

const Agent = use('App/Models/Agent')

const Division = use('App/Models/Division')

const User = use('App/Models/User')

const Event = use('Event')

class AgentController {
    //GET METHOD. Show a list of all the divisions
    async index({ view, auth, subdomains}) {
        return view.render('accounts.pages.agents.all')
    }

    //GET METHOD Render a form to be used for creating a new user
    create({view, params}){
        const {divisionid} = params
        return view.render('accounts.partials.agents.add',{
            divisionid
        })
    }
    
    //POST METHOS Create/save a new user.
    async store({auth,request,response, params}) {
        try {
            const values = request.all()

            //validate form inputs
            const rules = {
                a_email: 'required|email'
            }
            const messages = {
                'a_email.required': 'Agent email address is required.',
                'a_email.email': 'Invalid email address.'
            }

            const validation = await validateAll(values, rules, messages)

            if (validation.fails()) {
                var withErrors = validation.messages()
                return response.json(withErrors)
            }

            const agents = new Agent()
            const user = await auth.getUser()
            const divisionid = (values.parentid) ? values.parentid : values.d_id

            const division = await Division.find(divisionid)

            var token = RandomString({
              length: 40
            })
            var user_id = ''
            
            try {
                const user = await User.findBy('u_email', values.a_email)
                token = user.u_confirmation_token
                user_id = user.id
            } catch (error) {
                //Create user if not exist
                const user = await User.create({
                    u_email: values.a_email,
                    u_password: token,
                    u_role: 4,
                    u_confirmation_token: token
                })
                user_id = user.id
            }

            try {
                //create agent
                agents.fill({
                    user_id: user_id,
                    a_setup_complete: true,
                    a_confirmation_token: token
                })

               await division.agents().save(agents)
               
            } catch (error) {
                
            }
            
            try {
                //find user create
                //const user = await User.findBy('u_email', values.a_email)

                const user = await Agent.query()
                        .where('user_id', user_id)
                        .with('division.account')
                        .fetch()
                        .then(res => { return res.toJSON()})
                const agent = user[0]

                await Mail.send('emails.agents.invite', {
                      agent
                    }, (message) => {
                  message
                    .to(values.a_email)
                    .from('hello@adonisjs.com')
                    .subject('Chat Agent Invitation')
                })

                return response.json({
                    alert: {
                        type: 'success',
                        title: 'Success!',
                        message: 'Invitation sent!.',
                        ButtonText: '<i class="fas fa-thumbs-up"></i> Great!',
                        cancel: false,
                        cancelButtonText: '',
                        status: 'success',
                        reverse: false,
                        showLoader: true
                    }
                })
            } catch (error) {

                return response.json({
                    alert: {
                        type: 'info',
                        title: 'Oops...',
                        message: 'Invitation was not sent!',
                        ButtonText: '<i class="fas fa-envelope"></i> Resend Email!',
                        cancel: true,
                        cancelButtonText: '<i class="fas fa-times"></i> Cancel!',
                        reverse: true,
                        status: 'fail',
                        action_link: '/agents/resend/invite/' + user_id,
                        showLoader: true
                    }
                })
            }

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

    //confirm agent
    async confirm({response, params, session, auth}){

        try {
            //get user by token
            const user = await User.findBy('u_confirmation_token', params.token)

            //change user status to active
            user.u_is_active = true

            //persit user to database
            await user.save()

            Event.emit('new::notification', {
                n_sender: false,
                recipient_id: '',
                n_type: 'system',
                n_urgent: true,
                n_title: user.u_email,
                n_message: 'Accepted your invitation',

            })

            try {

                //login user
                await auth.remember(!!false).loginViaId(user.id)

                /*const agent = await Agent.findBy('user_id', user.id).then(res => {
                  return res.toJSON()
                })*/

                return response.redirect('/agents/' + user.id + '/edit')
                
            } catch (error) {
                session.flash({
                    alert : {
                        type: 'error',
                        title: 'Login Failed!',
                        message: 'Try to login on this page, use your email address and password ' + params.token,
                        confirmButtonText: 'Ok!',
                    }
                })
                return response.redirect('/')

            }

        } catch (error) {
            session.flash({
                    alert : {
                        type: 'error',
                        title: 'Validation Failed!',
                        message: 'Kindly ask your account administrator to resend your comfirmation code!!!',
                        confirmButtonText: 'Ok!',
                    }
                })
                
            return response.redirect(APP_URL)
        }
    }

    //send agent invitation link
    async resend({request,response, params}) {
        const {id} = params 
        try {
            const user = await Agent.query()
                .where('user_id', id)
                .with('user')
                .with('division.account')
                .fetch().then(res => { return res.toJSON()})
            
            const agent = user[0]

            //send confirmation code
            await Mail.send('emails.agents.invite', {agent}, (message) => {
                message
                .to(agent.user.u_email)
                .from('hello@adonisjs.com')
                .subject('Chat Agent Invitation')
            })

            return response.json({
                alert: {
                    type: 'success',
                    title: 'Success!',
                    message: 'Invitation sent!.',
                    cancelButtonText: '<i class="fas fa-thumbs-up"></i> Great!',
                }
            })
        } catch (error) {
            return response.json({
                alert: {
                    type: 'error',
                    title: 'Error!',
                    message: 'Invitation email was not sent, Try again later!',
                    cancelButtonText: 'Ok!',
                }
            })
        }
    }
    //GET METHOD. Display a single agent
    show({auth,response,view,session}) {

    }

    //GET METHOD. Render a form to update an existing agent.
    async edit({view, response, params}){
        //const agent = await Agent.find(params.id).then(res => {res.toJSON()})
        const user = await Agent.query()
            .where('user_id', params.id)
            .with('user')
            .fetch()
            .then(res => {
                return res.toJSON()
            })
        
        const agent = user[0]

        return view.render('accounts.pages.agents.edit', {
            agent
        })
    }
    
    //PUT/PATCH METHOD. Update agent details.
    async update({auth,request,response, params}){
        try {

            const values = request.all()
            
            //validate form inputs
            const rules = {
                a_username: 'required',
                a_email: 'required|email',
            }
            const messages = {
                'a_username.required': 'Username is required.',
                'a_email.required': 'Email field is required.',
                'a_email.email': 'Enter a valid email address.',
            }

            const validation = await validateAll(values, rules, messages)

            if (validation.fails()) {
                var withErrors = validation.messages()
                return response.json(withErrors)
            }

            const agent = await Agent.find(params.id)
            const user = await agent.user().fetch()

            //check if user with new email exist
            if (user.u_email != values.a_email) {
                const rules = {
                  a_email: 'unique:users,u_email',
                }
                const messages = {
                  'a_email.unique': 'A user with this email address already exist.'
                }

                const validation = await validateAll(values, rules, messages)

                if (validation.fails()) {
                    var withErrors = validation.messages()
                    return response.json(withErrors)
                }
            }

            //AuthorizationService.verifyPermisssion(account.company_id, company.id)
            agent.merge({
                a_username: values.a_username
            })

            user.merge({
                u_email: values.u_email
            })

            await agent.save()
            await user.save()

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

    //PUT METHOD upload profile picture
    async profilepic({params, response, request}){
        
        const agent = await Agent.find(params.id)
        const path = Helpers.publicPath('/uploads/profilePics/' + agent.user_id + '/')
        const profilePic = request.file('a_profilepic', {
          types: ['image'],
          size: Env.get('PROF_PIC_MAX_SIZE')
        })
        
        //Check if file a file aleady exist in user directory
        const exists = await Drive.exists(path)
        
        //Delete user directory if exist
        if (exists) {
           await Drive.delete(path)
        }

        //upload files
        await profilePic.move(path, {
            name: 'avatar.jpg'
        })

        if (!profilePic.moved()) {
            const error = profilePic.error();
            return response.json({
                alert: {
                    type: 'info',
                    title: 'Upload Failed!',
                    message: error.message,
                    confirmButtonText: 'Ok!',
                }
            })
        }
        
        return response.json({
          completed: true
        })
    }

    //DELETE METHODE. Delete a Agent with id.
    destroy(){
        
    }
}

module.exports = AgentController
