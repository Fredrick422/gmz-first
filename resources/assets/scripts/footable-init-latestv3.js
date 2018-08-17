
$(window).on('load', function() {
    // -----------------------------------------------------------------
	// Row Toggler
	// -----------------------------------------------------------------
	$('.demo-foo-row-toggler2').footable({
		"paging": {
			"size": 10
		}
	});
    // -----------------------------------------------------------------
	// Emplyee list ( Edit , Delete & save it)
	// -----------------------------------------------------------------
	jQuery(function($){
		var $modal = $('#editor-modal'),
			$editor = $('#editor'),
			$editorTitle = $('#editor-title'),
			ft = FooTable.init('#editing-example', {
				editing: {
					enabled: true,
					addRow: function(){
						$modal.removeData('row');
						$editor[0].reset();
						$editorTitle.text('Add a new row');
						$modal.modal('show');
					},
					editRow: function(row){
						var values = row.val();
						$editor.find('#id').val(values.id);
						$editor.find('#firstName').val(values.firstName);
						$editor.find('#lastName').val(values.lastName);
						$editor.find('#jobTitle').val(values.jobTitle);
						$editor.find('#startedOn').val(values.startedOn.format('YYYY-MM-DD'));
						$editor.find('#dob').val(values.dob.format('YYYY-MM-DD'));

						$modal.data('row', row);
						$editorTitle.text('Edit row #' + values.id);
						$modal.modal('show');
					},
					deleteRow: function(row){
						if (confirm('Are you sure you want to delete the row?')){
							row.delete();
						}
					}
				}
			}),
			uid = 10;

		$editor.on('submit', function(e){
			if (this.checkValidity && !this.checkValidity()) return;
			e.preventDefault();
			var row = $modal.data('row'),
				values = {
					id: $editor.find('#id').val(),
					firstName: $editor.find('#firstName').val(),
					lastName: $editor.find('#lastName').val(),
					jobTitle: $editor.find('#jobTitle').val(),
					startedOn: moment($editor.find('#startedOn').val(), 'YYYY-MM-DD'),
					dob: moment($editor.find('#dob').val(), 'YYYY-MM-DD')
				};

			if (row instanceof FooTable.Row){
				row.val(values);
			} else {
				values.id = uid++;
				ft.rows.add(values);
			}
			$modal.modal('hide');
		});
	});
    
    // -----------------------------------------------------------------
	// Contact Employee with image (you can sort)
	// -----------------------------------------------------------------
	 $('.footable').on({
		"init.ft.table": function(e, ft){
			
		}
	}).footable();
	
});
