    import {Controller} from "stimulus"

    export default class extends Controller {

    static get targets() {
        return ["a_id", "c_id", "a_name", "a_website_url"]
    }

    connect() {
        //console.log("Hello, Stimulus!", this.a_nameTarget.value)
    }

    initialize() {
        $('.accounts input').keypress(function () {
            $('button:disabled').attr('disabled', false)
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

    setLoader(action, html = '<i class="fas fa-spinner fa-spin"></i> Saving...') {
        action.innerHTML = html;
    }

    resetLoader(action, html = '<i class="fas fa fa-check"></i> Save') {
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

    store(evt){
        evt.preventDefault()
        const actionTarget = evt.currentTarget
        this.setLoader(actionTarget)
        const swalAlert = this.swalAlert()
        axios.post('/account', {
            a_name: this.a_nameTarget.value,
            a_website_url: this.a_website_urlTarget.value
        })
        .then(response => {
            this.resetLoader(actionTarget)
            if ('completed' in response.data) {
                $.toast({
                    heading: 'Saved!',
                    text: 'Changes saved!!!',
                    position: 'top-right',
                    loaderBg: '#FBAF3F',
                    icon: 'success',
                    hideAfter: 1000,
                    stack: 6
                });
                setTimeout(() => {
                    Turbolinks.visit(window.location, {action: 'replace'})
                }, 1000);
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
        
            var i = '';
            for (i = 0; i < response.data.length; i++) {
                var id = '#' + response.data[i].field,
                    element = $('#addAcount ' + id);
                element.addClass('is-invalid ');
                element.parents('.form-group').find('.invalid-feedback').text(response.data[i].message)
            }

            return true;
        })
        .catch(error => {
            this.resetLoader(actionTarget)
            this.error(swalAlert)
        });
    }

    update(evt) {
        evt.preventDefault()
        const id = this.a_idTarget.value
        const actionTarget = evt.currentTarget
        const swalAlert = this.swalAlert()
        this.setLoader(actionTarget)

        axios.put('/account/' + id, {
            a_name: this.a_nameTarget.value,
            a_website_url: this.a_website_urlTarget.value
        })
        .then(response => {
            this.resetLoader(actionTarget)
            if ('completed' in response.data) {
                $.toast({
                    heading: 'Saved!',
                    text: 'Changes saved!!!',
                    position: 'top-right',
                    loaderBg: '#FBAF3F',
                    icon: 'success',
                    hideAfter: 1000,
                    stack: 6
                });
                setTimeout(() => {
                    Turbolinks.visit(window.location, { action: 'replace' })
                }, 1000);
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
            
            var i = '';
            for (i = 0; i < response.data.length; i++) {
                var id = '#' + response.data[i].field,
                    element = $('#editAccount ' + id);
                element.addClass('is-invalid ');
                element.parents('.form-group').find('.invalid-feedback').text(response.data[i].message)
            }

            return true;
        })
        .catch(error => {

            this.resetLoader(actionTarget)

            this.error(swalAlert)

        });
    }

    validate(evt){
        evt.preventDefault()
        const swalAlert = this.swalAlert()
        const actionTarget = evt.currentTarget
        const id = this.a_idTarget.value
        this.setLoader(actionTarget, '<i class="fas fa-spinner fa-spin"></i> Validating...')
        axios.post('/account/validate/'+id).then(response => {
            
            this.resetLoader(actionTarget, '<i class="fas fa-check"></i> Validate Account')

            if ('completed' in response.data) {
                $.toast({
                    heading: 'Success!',
                    text: 'Redirecting in a few seconds!!!',
                    position: 'top-right',
                    loaderBg: '#FBAF3F',
                    icon: 'success',
                    hideAfter: 1000,
                    stack: 6
                });
                setTimeout(() => {
                    Turbolinks.visit(window.location, {action: 'replace'})
                }, 1000);
            }

            if ('alert' in response.data) {
                            
                swalAlert({
                    title: response.data.alert.title,
                    text: response.data.alert.message,
                    type: response.data.alert.type,
                    confirmButtonText: response.data.alert.ButtonText
                })

                return false;
            }

        }).catch(error =>{
            
            this.resetLoader(actionTarget, '<i class="fas fa-check"></i> Validate Account')

            this.error(swalAlert)

        })

    }

    destroy(evt) {
        evt.preventDefault()
        const id = this.a_idTarget.value
        const actionTarget = evt.currentTarget
        const swalAlert = this.swalAlert()
        this.setLoader(actionTarget, '<i class="fas fa-spinner fa-spin"> </i> Deleting...')

        swalAlert({
            title: 'Are you sure!',
            text: 'You will lose all data that belong to this account.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'No!',
            cancelButtonText: 'Yes Delete!'
        })
        .then((result) => {
           if (result.dismiss) {
            axios.delete('/account/delete/' + id)
            .then(response => {
                this.resetLoader(actionTarget, '<i class="fas fa-times"> </i> Delete')
                if ('completed' in response.data) {
                    $.toast({
                        heading: 'Deleted!',
                        text: 'Account deleted successfully!!!',
                        position: 'top-right',
                        loaderBg: '#FBAF3F',
                        icon: 'success',
                        hideAfter: 1000,
                        stack: 6
                    });
                    setTimeout(() => {
                        Turbolinks.visit(window.location, { action: 'replace' })
                    }, 1000);

                    return
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

                return true;
            })
            .catch(error => {
                this.resetLoader(actionTarget, '<i class="fas fa-times"> </i> Delete')
                swalAlert({
                    type: 'error',
                    title: 'error!',
                    text: 'Internal sever error, Please try again later',
                    confirmButtonText: 'Ok!'
                })
            });
          }
        })
    }
}