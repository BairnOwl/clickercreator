window.addEventListener('load', function() {

	$('#playButton').on('click', function(e) {

		 e.preventDefault();

		var form_data = new FormData($('#gameForm')[0]);
		console.log(form_data);

		console.log($('#gameForm').serialize());

		var data = $('#gameForm').serialize();

		$.ajax( {
			url: '/createGame',
			type: 'POST',
			dataType: 'json',
			data: data,
			processData: false,
			success: function (res) {
				console.log(res);
			}

		});
	});

}, false);