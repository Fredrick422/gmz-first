/*$(function() {
    "use strict";
    $('.modal-form form').on('submit', function(e) {
        e.preventDefault();
        var form = $(this),
            url = form.attr('action'),
            data = {},
            fields = ["u_email", "u_password", "l_email", "l_password", "u_password_confirmation", "u_aggree_to_terms", "u_remember"],

            i = '';
        for (i = 0; i < fields.length; i++) {
            var field = '#'+fields[i],
                value = $.trim($(field).val());
            if (value != '') {
                if ($(field).is('#u_aggree_to_terms')) {
                    if ($(field).is(':checked')) {
                        data[fields[i]] = value;
                    }else{
                        data[fields[i]] = '';
                    }
                } else if ($(field).is('#u_remember')) {
                    if ($(field).is(':checked')) {
                        data[fields[i]] = value;
                    } else {
                        data[fields[i]] = '';
                    }
                } else {
                    data[fields[i]] = value;
                }
            }
        }

        var request = $.ajax({
            url: url,
            method: "POST",
            dataType: "json",
            data: data,
            beforeSend: function (xhr) {
              xhr.overrideMimeType("text/plain; charset=x-user-defined");
            },
        });

        request.done(function (data) {
            if ('logged' in data) {
                Turbolinks.visit("https://accounts.gumzo.local:3333", {
                  action: 'replace'
                })
                return false;
            }

            if ('alert' in data) {
                $('.modal').modal('hide');
                $('input').val('');
                setTimeout(swal({
                    title: data.alert.title,
                    text: data.alert.message,
                    type: data.alert.type,
                    confirmButtonText: data.alert.ButtonText
                }), 3000);
                return false; 
            }

            var i = '';
            for (i = 0; i < data.length; i++) {
                var id = '#' + data[i].field,
                    field = form.find(id);
                field.addClass('is-invalid');
                field.parents('.form-group').find('.invalid-feedback').text(data[i].message)
                $('input[type="password"]').val('');
            }
        });

        request.fail(function (jqXHR, textStatus, errorThrown) {
            swal({
                title: textStatus+'!',
                text: errorThrown,
                type: 'error',
                confirmButtonText: 'Ok'
            })
        });
    });

});*/