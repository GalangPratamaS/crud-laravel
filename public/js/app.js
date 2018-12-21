//ini untuk create button supaya muncul pop up
$('body').on('click', '.modal-show', function (event) {
	event.preventDefault();

	var me = $(this),
		url = me.attr('href'),
		title = me.attr('title');

	$('#modal-title').text(title);
	$('#modal-btn-save').text(me.hasClass('edit') ? 'Update' : 'Create');

	$.ajax({
		url: url,
		dataType: 'html',
		success: function(response){
			$('#modal-body').html(response);
		}
	});

	$('#modal').modal('show');
});



////ini untuk button save supaya panggil function masukan data ke db
$('#modal-btn-save').click(function (event){
	event.preventDefault();

	var form = $('#modal-body form'),
		url = form.attr('action'),
		method = $('input[name=_method]').val() == undefined ? 'POST' : 'PUT';

		form.find('.help-block').remove();
		form.find('form-group').removeClass('has-error');

	$.ajax({
		url : url,
		method : method,
		data : form.serialize(),
		success: function(response){
			form.trigger('reset');
			$('#modal').modal('hide');
			$('#datatable').DataTable().ajax.reload();

			swal({
				type : 'success',
				title : 'Berhasil!',
				text : 'Data Telah Disimpan!'
			});
		},
		error : function (xhr){
			var res = xhr.responseJSON;

			if($.isEmptyObject(res) == false ){
				$.each(res.errors, function (key, value){
					$('#' + key)
						.closest('.form-group')
						.addClass('has-error')
						.append('<span class="help-block"><strong>' + value + '</strong></span>')
				});
			}
		}
	})



});

$('body').on('click', '.btn-delete', function (event) {
	event.preventDefault();

	var me = $(this),
		url = me.attr('href'),
		title = me.attr('title'),
		csrf_token = $('meta[name="csrf-token"]').attr('content');

	swal({
		title: 'Apakah kamu yakin akan menghapus ' + title + '?',
		text : 'Kamu tidak bisa mengembalikan data jika dihapus!',
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Ya, Hapus saja!'
	}).then((result) => {
		if(result.value) {
			$.ajax({
				url: url,
				type: "POST",
				data: {
					'_method': 'DELETE',
					'_token': csrf_token
				},
				success: function (response){
					
					swal({
						type: 'success',
						title: 'Berhasil',
						text: 'Data telah dihapus!'
					});
					$('#datatable').DataTable().ajax.reload();
				},
				error: function (xhr){
					swal({
						type: 'error',
						title: 'Oops...',
						text: 'Terjadi kesalahan!'
					});
				}
			});
		}
	});
});

$('body').on('click', '.btn-show', function (event){
	
	event.preventDefault();

	var me = $(this),
		url = me.attr('href'),
		title = me.attr('title');

	$('#modal-title').text(title);
	$('#modal-btn-save').addClass('hide');

	$.ajax({
		url: url,
		dataType: 'html',
		success: function(response){
			$('#modal-body').html(response);
		}
	});
	$('#modal').modal('show');
});