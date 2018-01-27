window.addEventListener('load', function() {

	$('#playButton').on('click', function(e) {

		 e.preventDefault();

		console.log($('#gameForm').serialize());

		var data = $('#gameForm').serialize();

		$.post( '/createGame', data, function( res ) {
		  console.log(res);
		});
	});

}, false);