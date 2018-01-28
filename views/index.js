function abbrNum(number, decPlaces) {
      // 2 decimal places => 100, 3 => 1000, etc
      decPlaces = Math.pow(10,decPlaces);
      
      // Enumerate number abbreviations
      var abbrev = [ "k", "m", "b", "tri" ];
      
      // Go through the array backwards, so we do the largest first
      for (var i=abbrev.length-1; i>=0; i--) {
      
        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);
      
        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;
      
             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }
      
             // Add the letter for the abbreviation
             number += abbrev[i];
      
             // We are done... stop
             break;
        }
      }
      
      return number;
      }

  var defaultImageId = '';

  var passiveClicksPerSec = 0;
  var manualClicks = 1;

  var clicks = 0;
  var isClicked = false;


window.addEventListener('load', function() {


function updateClicks(){
  $('#num-clicks').html(abbrNum(clicks,4));
  $(".achievement" ).each(function( index ) {
    if (clicks > $(this).find('.clickstounlock').first().val()) {
      var bg =  $(this).find('.item-box').first();
      bg.css('background-color', '#eee8aa');
      var img = $(this).find('.new-big-img').first(); // TODO: find out how to select the
      $("#big-image").attr("src",img.attr('src'));            // class .new-big-img
      var got =  $(this).find('.item-title').first();
      var name = got.val();
      var saveVal = $('#header .game-title').first();
      $('#header .game-title').first().val("Achievement unlocked: " + name).delay(2015)
                       .queue(function() {
                           $(this).val(saveVal);
                       });;
      return; // prevent from same achievement
    }
});
  }

  window.setInterval(function() {
    if (passiveClicksPerSec > 0) {
      clicks += passiveClicksPerSec;
        updateClicks();
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


$('.buyItem').click(purchase);

function purchase(e) {

    var cost = $(this).prev().val();

    var canBuy = clicks - cost;
    if (canBuy < 0)
      return;

    clicks -= cost;

        updateClicks();

    var quantity = $(this).next().val();
    $(this).next().val(parseInt(quantity) + 1);
    

    var advanced = $(this).next().next();

    addPassiveClicks(advanced.children('input.passiveClicks').val(), advanced.children('input.passiveSecs').val());
    multiplyManualClicks(advanced.children('input.manualClickMultiplier').val());
  }

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

  $('#big-image').mousedown(pulse);



  function startGame(data) {
    // $('#gameForm').hide();

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

      function pulse(){

        clicks += manualClicks;
        updateClicks();
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

      var mode = "gme";
      $(document).ready(function(){
        if (mode == "game") {
        $("body").attr("class","game");

          //$("#gameForm :input").prop("disabled", true);
        }
    });

}, false);