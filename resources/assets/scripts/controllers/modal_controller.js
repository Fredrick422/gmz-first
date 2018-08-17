import {
  Controller
} from "stimulus"

export default class extends Controller {

    connect() {
        //console.log("Hello, Stimulus!")
    }

    initialize() {

    }

    swalAlert() {
        const swalWithBootstrapButtons = swal.mixin({
            confirmButtonClass: 'btn btn-success btn-md mx-2',
            cancelButtonClass: 'btn btn-danger btn-md mx-2',
            buttonsStyling: false,
        })

        return swalWithBootstrapButtons;
    }

    setLoader(Modal) {
        $(Modal + ' .modal-dialog').addClass('modal-loader')
        $(Modal + ' .modal-content').html('<div class="modal-body text-center"><i class="fa-loader fas fa-spinner fa-spin fa-lg"></i></div>')
    }

    resetLoader(Modal) {
        $(Modal + ' .modal-dialog').removeClass('modal-loader')
        $(Modal + ' .modal-content').html('')
    }

    error(swalAlert) {
        swalAlert({
          type: 'error',
          title: 'error!',
          text: 'Internal sever error, Please try again later',
          confirmButtonText: 'Ok!'
        })
    }

    showmodal(Target, Modal){
        const url = Target.getAttribute('data-url')
        const radius = Target.getAttribute('no-radius')
        const swalAlert = this.swalAlert()

        $('.modal').hide('hide')

        if ($(Modal).modal('show')) {
          
            this.setLoader(Modal)

            axios.get(url).then(response => {

                this.resetLoader(Modal)
                if (radius == 'true') {
                   $(Modal + ' .modal-dialog').addClass('no-radius')
                }
                $(Modal + ' .modal-content').html(response.data)
                
            }).catch(error => {

                this.resetLoader(Modal)
                console.log(Modal)
                if($(Modal).modal('hide')){
                    this.error(swalAlert)
                }
            })
        }
    }

    default(evt){

        evt.preventDefault()
        const actionTarget = evt.currentTarget
        this.showmodal(actionTarget, '#default')
        
    }

    small (evt) {

        evt.preventDefault()
        const actionTarget = evt.currentTarget
        this.showmodal(actionTarget, '#small')
    }

    medium(evt) {

        evt.preventDefault()
        const actionTarget = evt.currentTarget
        this.showmodal(actionTarget, '#medium')

    }

    large(evt) {

        evt.preventDefault()
        const actionTarget = evt.currentTarget
        this.showmodal(actionTarget, '#large')

    }

    xlarge(evt) {

        evt.preventDefault()
        const actionTarget = evt.currentTarget
        this.showmodal(actionTarget, '#xlarge')

    }

}