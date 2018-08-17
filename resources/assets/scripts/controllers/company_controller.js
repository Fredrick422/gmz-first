import {Controller} from "stimulus"

export default class extends Controller {

  connect() {
    //console.log("Hello, Stimulus!", this.c_nameTarget.value)
  }
  static get targets() {
    return ["c_id","c_name", "c_country", "c_city", "c_address", "c_phone", "c_region", "c_zip"]
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

  setLoader(action, html = '<i class="fas fa-spinner fa-spin"></i> Saving...') {
    action.innerHTML = html
  }

  resetLoader(action, html = '<i class="fas fa fa-check"></i> Save') {
    action.innerHTML = html
  }

  update(evt) {
    evt.preventDefault()
    const actionTarget = evt.currentTarget
    const swalAlert = this.swalAlert()
    const id = this.c_idTarget.value

    this.setLoader(actionTarget)
    axios.put('/company/' + id, {
        c_name: this.c_nameTarget.value,
        c_country: this.c_countryTarget.value,
        c_city: this.c_cityTarget.value,
        c_address: this.c_addressTarget.value,
        c_phone: this.c_phoneTarget.value,
        c_region: this.c_regionTarget.value,
        c_zip: this.c_zipTarget.value
    })
    .then(response => {
      this.resetLoader(actionTarget)

      if ('completed' in response.data) {
          $.toast({
            heading: 'Success!',
            text: 'Changes saved!!!',
            position: 'top-right',
            loaderBg: '#FBAF3F',
            icon: 'success',
            hideAfter: 1000,
            stack: 6
        });
        //location.reload()
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
              field = $(id);
          field.addClass('is-invalid');
          field.parents('.form-group').find('.invalid-feedback').text(response.data[i].message)
      }

      return true;
    })
    .catch(error => {
      this.resetLoader(actionTarget)
      swalAlert({
        type: 'error',
        title: 'error!',
        text: 'Internal sever error, Please try again later',
        confirmButtonText: 'Ok!'
      })
    });
  }
}