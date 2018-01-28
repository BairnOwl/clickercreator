window.addEventListener('load', function() {

	var name = '';

	$('#playButton').on('click', function(e) {

		 e.preventDefault();

		// var form_data = new FormData($('#gameForm')[0]);
		// console.log(form_data);

		var reader = new FileReader();

		reader.onload = function (e) {
	        // console.log(reader.result + '->' + typeof reader.result)
	        var defaultImage = reader.result;
	        name = $('#defaultImage')[0]['files'][0].name;
	        localStorage.setItem(name, defaultImage);
	    };

	    reader.readAsDataURL($('#defaultImage')[0]['files'][0]);

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

	$('#testButton').on('click', function(e) {
		var dataImage = localStorage.getItem(name);
		console.log(dataImage);
    	$('#testImg').attr('src', dataImage);
	});

}, false);