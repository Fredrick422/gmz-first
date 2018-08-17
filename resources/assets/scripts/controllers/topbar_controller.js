import {Controller} from "stimulus"

export default class extends Controller {

    connect() {
        //console.log("Hello, Stimulus!")
    }
    static get targets() {
        return []
    }
    initialize() {}
    
    swalAlert() {
        const swalWithBootstrapButtons = swal.mixin({
            confirmButtonClass: 'btn btn-success btn-md mx-2',
            cancelButtonClass: 'btn btn-danger btn-md mx-2',
        buttonsStyling: false,
        })

        return swalWithBootstrapButtons;
    }

    setCurrentAccount(evt) {
        evt.preventDefault()
        const Target = evt.currentTarget
        const id = Target.value
        const swalAlert = this.swalAlert()
        const Parent = Target.parentElement.parentElement
        const Loader = Parent.lastElementChild
        Loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'

        axios.post('/account/current/' + id)
        .then(response => {
            Loader.innerHTML = '<i class="fas fa-plus"></i>'
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

            return true;
        })
        .catch(error => {
            Loader.innerHTML = '<i class="fas fa-plus"></i>'
            swalAlert({
                type: 'error',
                title: 'error!',
                text: 'Internal sever error, Please try again later',
                confirmButtonText: 'Ok!'
            })
        });
        
    }
}