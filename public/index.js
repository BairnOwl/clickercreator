window.addEventListener('load', function() {

	var defaultImageId = '';

	var passiveClicksPerSec = 0;
	var manualClicks = 1;

	$('#playButton').on('click', function(e) {

		 e.preventDefault();

		// var form_data = new FormData($('#gameForm')[0]);
		// console.log(form_data);

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

				var reader = new FileReader();

				reader.onload = function (e) {
			        // console.log(reader.result + '->' + typeof reader.result)
			        var defaultImage = reader.result;
			        defaultImageId = res['game'][0]['gameId'];
			        localStorage.setItem(defaultImageId, defaultImage);
			    };

			    reader.readAsDataURL($('#defaultImage')[0]['files'][0]);

			    startGame(res);
			}

		});
	});

	$('#testButton').on('click', function(e) {
		var dataImage = localStorage.getItem(name);
		console.log(dataImage);
    	$('#testImg').attr('src', dataImage);
	});


	$('#loadGame').on('click', function(e) {
		e.preventDefault();
		
		var data = $('#loadGameForm').serialize();
		console.log("OOOH");
		console.log(data);

		$.ajax( {
			url: '/loadGame',
			type: 'POST',
			dataType: 'json',
			data: data,
			processData: false,
			success: function (res) {
				console.log(res);

			    startGame(res);
			}

		});
	});



	function startGame(data) {
		$('#gameForm').hide();

		// for each item in store, append to store section

		// for each achievement, append to achievements section
	}

	function addManualClicks(num) {
		manualClicks += num;
	}

	function multiplyManualClicks(multiplier) {
		manualClicks *= multiplier;
	}

	function addPassiveClicks(num, secs) {
		passiveClicksPerSec += (num / secs);
	}

	function multiplyPassiveClicks(multiplier) {
		passiveClicksPerSec *= multiplier;
	}

}, false);