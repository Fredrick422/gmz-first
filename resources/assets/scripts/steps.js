$(document).on("turbolinks:load", function () {
  var step = Cookies.get('accountSetupStep') ? Cookies.get('accountSetupStep') : 0;
  if (step == 3) {
    Cookies.remove('accountSetupStep')
  }

  function stepsave(url, method, section, newindex, currentIndex) {
    const swalAlert = swal.mixin({
      confirmButtonClass: 'btn btn-success btn-lg mx-2',
      cancelButtonClass: 'btn btn-danger btn-lg mx-2',
      buttonsStyling: false,
    })
    var data = {},
      status = false;
    
    if (currentIndex > 0) {
       var parentSection = $('#steps-uid-0-p-' + (currentIndex - 1))
       data['parentid'] = parentSection.find('.section_id').val()
    }
    section.find('.form-group .form-control').each(function (index) {
      var value = $.trim($(this).val()),
        field = $.trim($(this).attr('name'));
      if (value != '') {
        data[field] = value
      }
    });

    function success(data) {

      if ('completed' in data) {
        Cookies.set('accountSetupStep', newindex, {
          expires: 90
        })

        let updateUrl = '/'+data.step+'/'+data.id
        
        section.find('.section_id').val(data.id)
        section.attr('action-url', updateUrl)
        section.attr('action-method', 'put')

        //$('#step_' + newindex).value(data.id)

        /*Turbolinks.visit(window.location, {
          action: 'replace'
        })*/
        return true
      }

      if ('alert' in data) {
        swalAlert({
          title: data.alert.title,
          text: data.alert.message,
          type: data.alert.type,
          confirmButtonText: data.alert.ButtonText,
          cancelButtonText: data.alert.cancelButtonText
        })
        return false;
      }

      for (let i = 0; i < data.length; i++) {
        var id = '#' + data[i].field,
          field = section.find(id);
        field.addClass('is-invalid');
        field.parents('.form-group').find('.invalid-feedback').text(data[i].message)
      }

      return false;
    }

    let request = $.ajax({
      url: url,
      async: false,
      method: method,
      dataType: "json",
      data: data,
      beforeSend: function (xhr) {

        $('a[href="#next"]').html('<i class="fas fa-spinner fa-spin"></i> Saving...')
        $('a[href="#finish"]').html('<i class="fas fa-spinner fa-spin"></i> Finishing...')
      }
    });
    request.done(function (data) {

        $('a[href="#finish"]').html('<i class="fas fa-check"></i> Finish')
        $('a[href="#next"]').html('<i class="fas fa-arrow-right"></i> Next')

      status = success(data)
    })

    request.fail(function (jqXHR, textStatus, errorThrown) {

      $('a[href="#next"]').html('<i class="fas fa-arrow-right"></i> Next')
      $('a[href="#finish"]').html('<i class="fas fa-check"></i> Finish')

      swalAlert({
        title: textStatus + '!',
        text: errorThrown,
        type: 'error',
        confirmButtonText: 'Ok'
      })

      status = false;
    });

    return status;
  }
  $(".account-wizard").steps({
    headerTag: "h6",
    bodyTag: "section",
    transitionEffect: "fade",
    titleTemplate: '<span class="step">#index#</span> #title#',
    startIndex: Number(step),
    labels: {
      cancel: '<i class="fas fa-times"></i> Cancel',
      current: "current step:",
      pagination: "Pagination",
      finish: '<i class="fas fa-check"></i> Finish',
      next: '<i class="fas fa-arrow-right"></i> Next',
      previous: '<i class="fas fa-arrow-left "></i>  Previous',
      loading: '<i class="fas fa-spinner fa-spin"></i> Saving...'
    },
    onStepChanging: function (event, currentIndex, newIndex) {
      if (currentIndex > newIndex) {
        return true;
      }

      var section = $('#steps-uid-0-p-' + currentIndex),
        url = section.attr('action-url'),
        method = section.attr('action-method');
        return stepsave(url, method, section, newIndex, currentIndex)

    },
    onFinishing: function (event, currentIndex, newIndex) {
      if (currentIndex > newIndex) {
        return true;
      }
      var section = $('#steps-uid-0-p-' + currentIndex),
        url = section.attr('action-url'),
        method = section.attr('action-method');

      return stepsave(url, method, section, newIndex, currentIndex);

    },
    onFinished: function (event, currentIndex) {
      Turbolinks.visit(window.location, {
        action: 'replace'
      })
      //window.location.replace("/");
    }
  });
})