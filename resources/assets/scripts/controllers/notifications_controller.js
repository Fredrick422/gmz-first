    import {Controller} from "stimulus"

    export default class extends Controller {

    static get targets() {
        return ["notification_id"]
    }

    connect() {
        //console.log("Hello, Stimulus!")
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

    destroy(evt) {
        evt.preventDefault()
        const id = this.notification_idTarget.id
        const actionTarget = evt.currentTarget
        const swalAlert = this.swalAlert()
        this.setLoader(actionTarget, '<i class="fas fa-spinner fa-spin"> </i>')

        axios.delete('/notifications/' + id)
        .then(response => {
            if ('completed' in response.data) {
                return actionTarget.parentElement.hidden = true
            }
        })
        .catch(error => {
            this.resetLoader(actionTarget, '<i class="fa fa-trash"></i>')
            swalAlert({
                type: 'error',
                title: 'error!',
                text: 'Internal sever error, Please try again later',
                confirmButtonText: 'Ok!'
            })
        });
    }
}