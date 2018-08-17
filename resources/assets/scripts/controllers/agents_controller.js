    import {Controller} from "stimulus"

    export default class extends Controller {

    static get targets() {
        return ["g_id", "d_id", "a_email", "a_username"]
    }

    connect() {
       //console.log('loaded')
    }

    initialize() {
        $('#addAgent input, #editAgent input').keypress(function () {
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

    setLoader(action, html = '<i class="fas fa-spinner fa-spin"></i> Sending Invitation...') {
        action.innerHTML = html;
    }

    resetLoader(action, html = '<i class="fas fa fa-check"></i> Invite') {
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

    divisionagents(id){

        axios.post('agents/'+id).then(response => {
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
        axios.post('/agents', {
            d_id: this.d_idTarget.value,
            a_email: this.a_emailTarget.value,
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
                let data = response.data
                
                swalAlert({
                    title: data.alert.title,
                    text: data.alert.message,
                    type: data.alert.type,
                    confirmButtonText: data.alert.ButtonText,
                    cancelButtonText: data.alert.cancelButtonText,
                    showLoaderOnConfirm: data.alert.showLoader,
                    preConfirm: () => {
                        if (data.alert.status === 'fail') {
                            let html = '<div style="height: 200px; opacity:0.5; line-height: 200px;"><i class="fas fa-spinner fa-spin fa-5x"></i></div>';
                            $('.swal2-modal').html(html)
                            axios.post(data.alert.action_link).then(res => {

                                swalAlert({
                                    title: res.data.alert.title,
                                    text: res.data.alert.message,
                                    type: res.data.alert.type,
                                    cancelButtonText: res.data.alert.cancelButtonText
                                })

                            }).catch(error => {
                                this.error(swalAlert)
                            })
                        }
                    },
                    allowOutsideClick: () => !swal.isLoading()
                })
            }

            return this.invalid('#addAgent', response.data)
        })
        .catch(error => {
            this.resetLoader(actionTarget)
            this.error(swalAlert)
        });
    }

    update(evt) {
        evt.preventDefault()
        const id = this.g_idTarget.value
        const actionTarget = evt.currentTarget
        const swalAlert = this.swalAlert()
        
        this.setLoader(actionTarget, '<i class="fas fa-spinner fa-spin"></i> Saving...')
        axios.put('/agents/' + id, {
            a_username: this.a_usernameTarget.value,
            a_email: this.a_emailTarget.value,
        })
        .then(response => {
            this.resetLoader(actionTarget, '<i class="fas fa-check"></i> Save')
            if ('completed' in response.data) {
                $.toast({
                    heading: 'Success!',
                    text: 'Profile Updated!!!',
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
            
            return this.invalid('#editAgent', response.data)
        })
        .catch(error => {

            this.resetLoader(actionTarget, '<i class="fas fa-check"></i> Save')

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
            text: 'You want to delete this division?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'No!',
            cancelButtonText: 'Delete!'
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
                this.error(swalAlert)
            });
          }
        })
    }

    profpic(evt){
        evt.preventDefault()
        const actionTarget = evt.currentTarget
        const file = actionTarget.files[0]
        const id = this.g_idTarget.value
        const swalAlert = this.swalAlert()
        const object = $('.edit-prf-pic img')
        const currentfile = object.attr('src')

        if (file) {
            var r = new FileReader();
            r.onload = function (e) {
                var url = e.target.result;
                object.attr('src', url).css({
                    'height': '5%'
                })
            }
            r.readAsDataURL(file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    var opacity = Math.round((progressEvent.loaded) / progressEvent.total)
                    $(function () {
                        object.css({
                            'height': percentCompleted + '%',
                            'opacity': opacity
                        })
                    })
                }
            }

            let data = new FormData()

            data.append('a_profilepic', file)

            axios.put('/agents/' + id + '/profile/upload', data, config).then(response => {
                console.log(response)
                if ('completed' in response.data) {
                    $.toast({
                        heading: 'Success!',
                        text: 'Profile Updated!!!',
                        position: 'top-right',
                        loaderBg: '#FBAF3F',
                        icon: 'success',
                        hideAfter: 1000,
                        stack: 6
                    });
                    setTimeout(() => {
                      Turbolinks.visit(window.location, {
                        action: 'replace'
                      })
                    }, 1000);
                    return true
                }

                if ('alert' in response.data) {
                    object.attr('src', currentfile)
                    swalAlert({
                        title: response.data.alert.title,
                        text: response.data.alert.message,
                        type: response.data.alert.type,
                        cancelButtonText: response.data.alert.cancelButtonText
                    })
                    return false;
                }
            })
            .catch(err => {
                this.error(swalAlert)
            })
        }
        
    }
}