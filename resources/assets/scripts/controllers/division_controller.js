    import {Controller} from "stimulus"

    export default class extends Controller {

    static get targets() {
        return ["a_id", "d_id", "d_name", "list"] 
    }

    connect() {

        const id = this.a_idTarget.value ? this.a_idTarget.value : false

        if (id) {
            this.accountdivisions(id)
        }

    }

    initialize() {
        $('#addDivision input, #editDivision input').keypress(function () {
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

    accountdivisions(id){

        axios.post('divisions/'+id).then(response => {
            const data = response.data

            this.listTarget.innerHTML = data

            return

        }).catch(error => { 
            $('.list-divisions').html('<div class="text-center"><span class="text-muted align-middle text-center">Divisions could not be loaded.</span></div>')
        })
    }

    store(evt){
        evt.preventDefault()
        const actionTarget = evt.currentTarget
        this.setLoader(actionTarget)
        const swalAlert = this.swalAlert()
        axios.post('/divisions', {
            d_name: this.d_nameTarget.value,
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
                    element = $('#addDivision ' + id);
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
        const id = this.d_idTarget.value
        const actionTarget = evt.currentTarget
        const swalAlert = this.swalAlert()
        
        this.setLoader(actionTarget)
        axios.put('/divisions/' + id, {
            d_name: this.d_nameTarget.value,
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
                    element = $('#editDivision ' + id);
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

    
    destroy(evt) {
        evt.preventDefault()
        const actionTarget = evt.currentTarget
        const url = actionTarget.getAttribute('data-url')
        const swalAlert = this.swalAlert()

        swalAlert({
            title: 'Are you sure!',
            text: 'You will lose all data that belong to this division.',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'No!',
            cancelButtonText: 'Yes Delete!'
        })
        .then((result) => {
           if (result.dismiss) {
            axios.delete(url)
            .then(response => {
                if ('completed' in response.data) {
                    $.toast({
                        heading: 'Success!',
                        text: 'Division deleted!!!',
                        position: 'top-right',
                        loaderBg: '#FBAF3F',
                        icon: 'success',
                        hideAfter: 1000,
                        stack: 6
                    });
                    setTimeout(() => {
                        Turbolinks.visit(window.location, { action: 'replace' })
                    }, 1600);

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