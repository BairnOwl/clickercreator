window.addEventListener('load', function() {

	var defaultImageId = '';

	var passiveClicksPerSec = 0;
	var manualClicks = 1;

	var clicks = 0;
    var isClicked = false;

	window.setInterval(function() {
		if (passiveClicksPerSec > 0) {
			clicks += passiveClicksPerSec;
			$('#num-clicks').html(clicks);
		}
	}, 1000);

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

	$('.buyItem').on('click', function(e) {
		e.preventDefault();

		var cost = $(this).prev().val();
		var quantity = $(this).next().val();

		$(this).next().val(parseInt(quantity) + 1);

		var advanced = $(this).next().next();

		addPassiveClicks(advanced.children('input.passiveClicks').val(), advanced.children('input.passiveSecs').val());
		multiplyManualClicks(advanced.children('input.manualClickMultiplier').val());
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

	$('#mainImage').mousedown(pulse);



	function startGame(data) {
		// $('#gameForm').hide();

		// for each item in store, append to store section

		// for each achievement, append to achievements section
	}

	function addManualClicks(num) {
		manualClicks += num;
	}

	function multiplyManualClicks(multiplier) {
		console.log('multiply manual clilk ' + multiplier);
		manualClicks *= multiplier;
	}

	function addPassiveClicks(num, secs) {
		passiveClicksPerSec += (num / secs);
	}

	function multiplyPassiveClicks(multiplier) {
		passiveClicksPerSec *= multiplier;
	}

	// appends a clone of element to the end of appendTo
      function cloneElement(element, appendTo){
        var elmnt = document.getElementById(element);
        var cln = elmnt.cloneNode(true);
        document.getElementById(appendTo).appendChild(cln);
      }

      function pulse(){
        clicks += manualClicks;
        $('#num-clicks').html(clicks);
        $('#big-image').clearQueue();
        $('#big-image').addClass("transform-active")
                       .delay(115)
                       .queue(function() {
                           $(this).removeClass("transform-active");
                           $(this).dequeue();
                       });
        }

        /*
        if (document.getElementById("big-image").style.WebkitAnimationPlayState == "paused")
          document.getElementById("big-image").style.WebkitAnimationPlayState = "running";
        else
          document.getElementById("big-image").style.WebkitAnimationPlayState = "paused";*/
      function showimg(caller){
        for (var i = 0; i < caller.files.length; i++) {  
          var file = caller.files[i];
          var img = document.createElement("img");
          var reader = new FileReader();
          reader.onloadend = function() {
               img.src = reader.result;
               $(caller).prev("img").attr("src",img.src);
          }
          reader.readAsDataURL(file);
        }
      }

      var mode = "gamey";
      $(document).ready(function(){
        if (mode == "game") {
        $("body").attr("id","game");
          $("#gameForm :input").prop("disabled", true);
        }
    });

}, false);