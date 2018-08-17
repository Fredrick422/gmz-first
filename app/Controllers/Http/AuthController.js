'use strict'
const {validateAll} = use('Validator')
const RandomString = require('random-string')
const Mail = use('Mail')
const Hash = use('Hash')
const Env = use('Env')
const AccountService = use('App/Services/AccountService')
const ACCOUNTS_URL  = Env.get('ACCOUNTS_URL')
const EMAIL_NOREPLY = Env.get('EMAIL_NOREPLY')
const APP_URL = Env.get('APP_URL')
const User = use('App/Models/User')

class AuthController {

    //show  register form
    registerform({view}){
       return view.render('partials.auth.register');
    }

    //show login form
    loginform({view}){
        return view.render('partials.auth.login');
    }

    //show password rest form
    async resetform({params,session,response, view}){
        //get user with reset token
        const user = await User.findBy('u_confirmation_token', params.token)
        if(user){
            //render password reset view
            return view.render('Auth.passwords.reset', {
                title: 'Password Reset',
                token: params.token
            })
        }else{
            session.flash({
                    alert: {
                        type: 'warning',
                        title: 'Invalid Token!',
                        message: 'Please use password reset form to get a valid token!!!',
                        confirmButtonText: 'Ok!'
                    }
                })

            return response.redirect(APP_URL)
        }
    }

    //show email password rest form
    emailresetform() {

    }

    //register user
    async register({request,session,response}){
       //validate form inputs
        const rules = {
            u_email: 'required|email|unique:users,u_email',
            u_password: 'required|min:6|max:30|alpha_numeric|confirmed',
            u_aggree_to_terms: 'required',
            u_password_confirmation: 'required'
        }
        const messages = {
            'u_email.required': 'Email field is required.',
            'u_email.unique': 'A user with this email address already exist.',
            'u_email.email': 'Enter a valid email address.',
            'u_password.required': 'Password is required.',
            'u_password.min': 'Password must be at least 6 character long.',
            'u_password.max': 'Password is too long, you need a maximum of 30 characters',
            'u_password.alpha_numeric': 'Password must contain at least Numbers,Uppercase and Lowercase',
            'u_password.confirmed': 'Passwords do not match.',
            'u_password.required': 'Password is required.',
            'u_aggree_to_terms.required': 'Your must agree to terms of service',
            'u_password_confirmation.required': 'Confirm your password.'
        }

        const validation = await validateAll(request.all(), rules, messages)

        if (validation.fails()) {
            var withErrors =  validation.messages()
            return response.json(withErrors)
        }

        try {
            //create the user
            const user = await User.create({
                u_email: request.input('u_email'),
                u_password: request.input('u_password'),
                u_role: 3,
                u_confirmation_token: RandomString({
                    length: 40
                })
            })
            
            //send email confirmation code
            try {
               
                //send confirmation code
                await Mail.send('auth.emails.confirm_email', user.toJSON(), (message) => {
                    message
                    .to(user.u_email)
                    .from(EMAIL_NOREPLY)
                    .subject('Confirm Your Email Address')
                })

               return response.json({
                alert: {
                        type: 'success',
                        title: 'Confirmation token sent!',
                        message: 'Confirmation token was sent to your email address!!',
                        confirmButtonText: 'Ok!'
                    }
                })
            } catch (error) {
                return response.json({
                    alert: {
                        type: 'error',
                        title: 'Error!',
                        message: 'Confirmation token was not sent!!!',
                        confirmButtonText: 'Ok!'
                    }
                })
            }
            
        } catch (error) {
            return response.json({
                alert: {
                    type: 'error', 
                    title: 'User already exist',
                    message: 'Please Login with your password.',
                    confirmButtonText: 'Ok'
                }
            })
        }
    
    }
    
    //login user
    async login({request, auth, session,response}){
        //validate form inputs
        const rules = {
            l_email: 'required|email',
            l_password: 'required'
        }

        const messages = {
            'l_email.required': 'Email field is required.',
            'l_email.email': 'Enter a valid email.',
            'l_password.required': 'Password is required.'
        }

        const validation = await validateAll(request.all(), rules, messages)

        if (validation.fails()) {
            var withErrors = validation.messages()
            return response.json(withErrors)
        }

        try {
            //Retrive use based on form data
            const user = await User.query().where('u_email', request.input('l_email')).first()

            if (user.u_is_active == true) {
                try {
                    const remember = (request.input('l_remember') == '1') ? true : false

                    await Hash.verify(request.input('l_password'), user.u_password)

                    await auth.remember(!!remember).login(user)

                    //display success toast message
                    session.flash({
                        toast: {
                            type: 'success',
                            heading: 'Welcome Back',
                            text: '',
                            icon: 'success',
                            timer: 3500
                        }
                    })
                    
                    return response.json({
                        logged: true,
                        user: auth.user.u_role,
                        url: ACCOUNTS_URL
                    })

                } catch (error) {
                    return response.json({
                        alert: {
                            type: 'error',
                            title: 'Error!',
                            message: 'You entered a wrong password!',
                            ButtonText: 'OK'
                        }
                    })
                }
            } else {
                return response.json({
                    alert: {
                        type: 'error',
                        title: 'Error!',
                        message: 'Please confirm your email address',
                        ButtonText: 'Ok'
                    }
                })
            }

        } catch (error) {
            return response.json({
                alert: {
                    type: 'error',
                    title: 'Error!',
                    message: 'Internal Server Error!',
                    ButtonText: 'Ok'
                }
            })
        }
    }
    
    //confrim user email
    async confrim({params,session,response, auth}){
        try {
            //get user with confirmation token
            const user = await User.findBy('u_confirmation_token', params.token)

            //set confirmation null and is active to true
            user.u_is_active = true

            //persist user to database
            await user.save()

            //display success message
            session.flash({
                toast: {
                    icon: 'success',
                    heading: 'Success!',
                    text: 'You successfully confirmed your email address!',
                }
            })

            try {
                await auth.remember(!!false).loginViaId(user.id)

                //display success toast message
                session.flash({
                    toast: {
                        icon: 'success',
                        heading: 'Welcome!!!', 
                        text: 'Email address confirmed successfully!!!',
                        timer: 3600
                    }
                })

                return response.redirect(ACCOUNTS_URL)

            } catch (error) {
                
                //display success toast message
                session.flash({
                    alert: {
                        type: 'error',
                        title: 'Error!',
                        message: 'Login Failed!!!',
                        confirmButtonText: 'OK!'
                    }
                })
            }

        } catch (error) {

            session.flash({
                alert: {
                    type: 'error',
                    title: 'Error!',
                    message: 'Email Confirmation failed!!!',
                    confirmButtonText: 'Resend Token!'
                }
            })
        }

        return response.redirect('/')
    
    } 

    //send password reset link
    async resetlink({request, response}){
        //validate form inputs
        const rules = {
            r_email: 'required|email',
        }

        const messages = {
          'r_email.required': 'Email field is required.',
          'r_email.email': 'Enter a valid email.'
        }

        const validation = await validateAll(request.only('r_email'), rules, messages)

        if (validation.fails()) {
            var withErrors = validation.messages()
            return response.json(withErrors)
        }

        try {
            //get user
            const user = await User.findBy('u_email', request.input('r_email'))
            
            user.u_confirmation_token = RandomString({
               length: 40
            })

            await user.save()

            try {
                
                const Account = await AccountService.agentAccount(user.id)
                const data = {
                  'user': user.toJSON(),
                  'account': Account
                }
                
                //send confirmation code
                await Mail.send('auth.emails.reset_email', data, (message) => {
                  message
                    .to(user.u_email)
                    .from(EMAIL_NOREPLY, 'Gumzo.io')
                    .subject('Password Reset')
                })

                return response.json({
                    alert: {
                        type: 'success',
                        title: 'Success!',
                        message: 'Confirmation Mail has been sent!',
                        ButtonText: '<i class="fas fa-thumbs-up"></i> Great!'
                    }
                })
            } catch (error) {

                return response.json({
                    alert: {
                        type: 'error',
                        title: 'Failed!',
                        message: 'Something went wrong, try again later',
                        ButtonText: 'Ok!'
                    }
                })
            }

        } catch (error) {

            return response.json({
                alert: {
                    type: 'error',
                    title: 'User not found!',
                    message: 'Sorry there is no user with this email address!',
                    ButtonText: 'Ok!'
                }
            })
        }

    }

    //password rest
    async reset({request, session, response, auth}){
        //validate form inputs
        const rules = {
            u_password: 'required|min:6|max:30|alpha_numeric|confirmed',
            u_password_confirmation: 'required'
        }

        const messages = {
            'u_password.required': 'Password is required.',
            'u_password.min': 'Password must be at least 6 character long.',
            'u_password.max': 'Password is too long, you need a maximum of 30 characters',
            'u_password.alpha_numeric': 'Password must contain at least Numbers,Uppercase and Lowercase',
            'u_password.confirmed': 'Passwords do not match.',
            'u_password.required': 'Password is required.',
            'u_password_confirmation.required': 'Confirm your password.',
        }

        const validation = await validateAll(request.all(), rules, messages)

        if (validation.fails()) {
            var withErrors = validation.messages()
            return response.json(withErrors)
        }

        try {
            //get user with reset token
            const user = await User.findBy('u_confirmation_token', request.input('c_token'))

            try {
                //create new password
                user.u_password = request.input('u_password')

                //persist user to database
                await user.save()

                await auth.remember(!!false).loginViaId(user.id)

                session.flash({
                    toast: {
                        icon: 'success',
                        heading: 'Success!',
                        text: 'Password was changed!!!'
                    }
                })

                return response.json({
                    complete: true,
                    user: auth.u_role,
                    url: ACCOUNTS_URL
                })

            } catch (error) {

                return response.json({
                    alert: {
                        type: 'error',
                        title: 'Failed',
                        message: 'Password reset failed, Please try again later!',
                        ButtonText: 'Ok!'
                    }
                })
            }

        } catch (error) {
            return response.json({
                alert: {
                    type: 'error',
                    title: 'Invalid Token',
                    ButtonText: 'Ok!'
                }
            })
        }
    }

    //logout user
    async logout({auth, response}){
        await auth.logout()
        return response.redirect('/')
    }
}


module.exports = AuthController
