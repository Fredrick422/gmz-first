    import {Controller} from "stimulus"

    export default class extends Controller {

    static get targets() {
        return [
            "l_password",
            "l_email", 
            "l_remember", 
            "r_email", 
            "c_token", 
            "u_email",
            "u_password", 
            "u_password_confirmation",
            "u_aggree_to_terms",
        ]
    }

    connect() {
        //console.log("Hello, Stimulus!")
    }

    initialize() {
        $('#authForm input').keypress(function () {
            $('button:disabled').attr('disabled', false)
            $(this).hasClass('is-invalid') ? $(this).removeClass('is-invalid') : '';
        })
        $('#authForm input').change(function () {
          $(this).hasClass('is-invalid') ? $(this).removeClass('is-invalid') : '';
        })
    }

    swalAlert() {
        const swalWithBootstrapButtons = swal.mixin({
            confirmButtonClass: 'btn btn-success btn-md mx-2',
            cancelButtonClass: 'btn btn-danger btn-md mx-2',
            buttonsStyling: false,
        })

        return swalWithBootstrapButtons;
    }

    setLoader(action, html = '<i class="fas fa-spinner fa-spin"></i> Authenticating...') {
        action.innerHTML = html;
    }

    resetLoader(action, html = '<i class="zmdi zmdi-sign-in px-3"></i> LogIn') {
        action.disabled = true
        action.innerHTML = html
    }

    error(swalAlert) {
        swalAlert({
            type: 'error',
            title: 'error!',
            text: 'Internal sever error, Please try again later',
            confirmButtonText: 'Ok!'
        })
    }

    invalid(parent, data){
        var i = '';
        for (i = 0; i < data.length; i++) {
                var id = '#' + data[i].field,
                        element = $(parent +' '+ id);
                element.addClass('is-invalid ');
                element.parents('.form-group').find('.invalid-feedback').text(data[i].message)
        }

       return true
    }

    register(evt){
        evt.preventDefault()
        const actionTarget = evt.currentTarget
        this.setLoader(actionTarget, '<i class="fas fa-spinner fa-spin"></i> Registering...')
        const swalAlert = this.swalAlert()
        axios.post('/register', {
            u_email: this.u_emailTarget.value,
            u_password: this.u_passwordTarget.value,
            u_password_confirmation: this.u_password_confirmationTarget.value,
            u_aggree_to_terms: this.u_aggree_to_termsTarget.checked ? this.u_aggree_to_termsTarget.value : ''
        })
        .then(response => {
            this.resetLoader(actionTarget, '<i class="zmdi zmdi-account-add px-3"></i> Register')

            if ('alert' in response.data) {
                swalAlert({
                    title: response.data.alert.title,
                    text: response.data.alert.message,
                    type: response.data.alert.type,
                    confirmButtonText: response.data.alert.confirmButtonText
                })
                return false;
            }
        
            return this.invalid('#authForm', response.data)

        })
        .catch(error => {
            this.resetLoader(actionTarget, '<i class="zmdi zmdi-account-add px-3"></i> Register')
            this.error(swalAlert)
        });
    }

    login(evt) {
        evt.preventDefault()
        const actionTarget = evt.currentTarget
        const swalAlert = this.swalAlert()
        this.setLoader(actionTarget)

        axios.post('/login', {
            l_email: this.l_emailTarget.value,
            l_password: this.l_passwordTarget.value,
            l_remember: this.l_rememberTarget.checked ?  this.l_rememberTarget.value : false
        })
        .then(response => {
            
            this.resetLoader(actionTarget)
            if ('logged' in response.data) {
                if (response.data.user == 3) {
                    Turbolinks.visit(response.data.url, {
                        action: 'replace'
                    })
                   return true
                }

                Turbolinks.visit(window.location, {
                  action: 'replace'
                })
                return true
            }

            if ('alert' in response.data) {

                swalAlert({
                    title: response.data.alert.title,
                    text: response.data.alert.message,
                    type: response.data.alert.type,
                    confirmButtonText: response.data.alert.ButtonText,
                    cancelButtonText: response.data.alert.cancelButtonText
                })
                return false;
            }
            
            return this.invalid('#authForm', response.data)

        })
        .catch(error => {

            this.resetLoader(actionTarget)

            this.error(swalAlert)

        });
    }

    send(evt){
        evt.preventDefault()
        const actionTarget = evt.currentTarget
        const swalAlert = this.swalAlert()
        this.setLoader(actionTarget, '<i class="fas fa-spinner fa-spin"></i> Validating...')
        
        axios.post('/password/email', {
            r_email : this.r_emailTarget.value
        }).then(response => {

            this.resetLoader(actionTarget, '<i class="zmdi zmdi-refresh"></i> Reset')

            if ('alert' in response.data) {
                swalAlert({
                    title: response.data.alert.title,
                    text: response.data.alert.message,
                    type: response.data.alert.type,
                    confirmButtonText: response.data.alert.ButtonText,
                    cancelButtonText: response.data.alert.cancelButtonText
                })
                return false;
            }

            return this.invalid('#authForm', response.data)

        }).catch(error => {

            this.resetLoader(actionTarget, '<i class="zmdi zmdi-refresh"></i> Reset')

            this.error(swalAlert)
        });
    }

    reset(evt){
        evt.preventDefault()
        const actionTarget = evt.currentTarget
        const swalAlert = this.swalAlert()
        this.setLoader(actionTarget, '<i class="fas fa-spinner fa-spin"></i> Updating...')
        
        axios.post('/password/reset', {
            c_token: this.c_tokenTarget.value,
            u_password: this.u_passwordTarget.value,
            u_password_confirmation: this.u_password_confirmationTarget.value,
        }).then(response => {

            this.resetLoader(actionTarget, '<i class="zmdi zmdi-refresh"></i> Reset')

            if ('complete' in response.data) {
                /*if (response.data.user == 6) {
                    Turbolinks.visit(response.data.url, {
                        action: 'replace'
                    })
                   return true
                }*/

                Turbolinks.visit('/', {
                  action: 'replace'
                })
                return true
            }

            if ('alert' in response.data) {
                swalAlert({
                    title: response.data.alert.title,
                    text: response.data.alert.message,
                    type: response.data.alert.type,
                    confirmButtonText: response.data.alert.ButtonText,
                    cancelButtonText: response.data.alert.cancelButtonText
                })
                return false;
            }

            return this.invalid('#authForm', response.data)

        }).catch(error => {

            this.resetLoader(actionTarget, '<i class="zmdi zmdi-refresh"></i> Reset')

            this.error(swalAlert)
        });
    }

    toreset(evt){
       evt.preventDefault()
       $("#loginform").slideUp();
       $("#recoverform").fadeIn();
    }

    tologin(evt){
       evt.preventDefault()
       $("#loginform").slideDown();
       $("#recoverform").fadeOut();
    }
}