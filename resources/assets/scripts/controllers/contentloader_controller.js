import {Controller} from "stimulus"

export default class extends Controller {

    connect() {
        //console.log("Hello, Stimulus!")
    }
    static get targets() {
        return ['content']
    }
    initialize() {}

    setLoader(target) {
        $('.loaded-content').html('<div class="content-loader text-center"><i class="fa-loader fas fa-spinner fa-spin fa-lg"></i></div>')
    }

    resetLoader(target) {
        $('.loaded-content').html('')
    }

    swalAlert() {
        const swalWithBootstrapButtons = swal.mixin({
            confirmButtonClass: 'btn btn-success btn-md mx-2',
            cancelButtonClass: 'btn btn-danger btn-md mx-2',
        buttonsStyling: false,
        })

        return swalWithBootstrapButtons;
    }

    error(swalAlert) {
        swalAlert({
          type: 'error',
          title: 'error!',
          text: 'Internal sever error, Please try again later!',
          confirmButtonText: 'Ok!'
        })
    }

    load(evt){
        evt.preventDefault()
        const actionTarget = evt.currentTarget
        const url = actionTarget.getAttribute('data-url')
        const content = this.contentTarget
        const swalAlert = this.swalAlert()

        this.setLoader(content)
        
        axios.get(url).then(res => {
            this.resetLoader(content)
            content.innerHTML = res.data
        }).catch(error => {
            console.log(error)
            this.resetLoader(content)
            this.error(swalAlert)
        })
    }
}