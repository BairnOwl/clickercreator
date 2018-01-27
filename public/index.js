window.addEventListener('load', function() {

	$("playButton").on('click', function() {

		var data = {

		}

		$.post( '/createGame', data, function( res ) {
		  console.log(res);
		});
	}

}, false);