var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://database.db');

var path = require('path');
var fs = require('fs');
var multer = require('multer'); 

var engine = require('consolidate');

var Promise = require('promise');

app.engine('html', engine.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/views'); // tell Express where to find templates
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(bodyParser({uploadDir:'/images'}));

app.use(express.static(__dirname + '/views'));
app.engine('html', engine.mustache);
app.set('view engine', 'html');

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({ storage: Storage }).array("imgUploader", 3); 

var gameID = 0;
var achievementID = 0;
var itemID = 0;

app.get('/', function(request, response) {
    response.render('index.html');
    var sql = 'SELECT count(gameID) as numGames FROM Game';
    gameID = conn.query(sql, function(err, res) {
        gameID = res.rows[0]['numGames'];
    });; 


    var sql = 'SELECT count(achievementID) as numAchievement FROM Achievements';
    achievementID = conn.query(sql, function(err, res) {
   
        achievementID = res.rows[0]['numAchievement'];
    }); 

    var sql = 'SELECT count(itemID) as numStore FROM Store';
    itemID = conn.query(sql, function(err, res) {
        itemID = res.rows[0]['numStore'];
    });; 

});

/* 
	{
		game: {
			gameTitle: "",
			defaultImage: "",
			clickName: "",
			achievementsTitle: "",
			storeName: "",
			clickOverride: int,
			overrideIcon: int,
			clickSFX: ""
		}, 
		achievements: [ 
				{
					name: "",
					achievementimage: "",
					clicksToUnlock: int,
					changesBigImage: int,
					newBigImage: "",
					message: ""
				}, {}
			]

		},
		store:  [
				{
					title: "",
					storeimage: "",
					cost: int,
					description: ""
					costMultiplier: int,
					passiveClicks: int,
					passiveSecs: int,
					manualClickMultiplier: int,
					autoClick: int,
					manualClick: int,
				}
			]
		
	}
*/


app.post('/createGame', function(req, result) {

	// Game section

	console.log(req.body);
	
	var gameTitle = req.body['game']['gameTitle'];
	var defaultImage = req.body['game']['defaultImage'];
	var clickName = req.body['game']['clickName'];
	var achievementsTitle = req.body['game']['achievementsTitle'];
	var storeName = req.body['game']['storeName'];
	var clickOverride = req.body['game']['clickOverride'];
	var overrideIcon = req.body['game']['overrideIcon'];
	
	
	// Pick URL over file upload. 
	var defaultImageURL = req.body['game']['defaultImageURL'];
	if(defaultImageURL != 'undefined' || defaultImageURL != '') {
		defaultImage = defaultImageURL;
	}

	var overrideIconURL = req.body['game']['overrideIconURL'];
	if(overrideIconURL != 'undefined' || overrideIconURL != '') {
		overrideIcon = overrideIconURL;
	}

	var clickSFX = "";
	if (typeof clickSFX == 'undefined' || clickSFX == 'undefined') {
		clickSFX = "";
	} else {
		clickSFX = req.body['game']['clickSFX'];
	}

	console.log("CLICK OVERRIDE");
	console.log(clickOverride);
	if (typeof clickOverride == 'undefined') {
		clickOverride = 0;
	} else {
		clickOverride = parseInt(clickOverride);
	}

	if (typeof overrideIcon == 'undefined') {
		overrideIcon = "";
	} else {
		overrideIcon = overrideIcon;
	}


	// upload(defaultImage, res, function (err) { 
 //        if (err) { 
 //            console.log("Something went wrong!"); 
 //        } 
 //        console.log('successfully uploaded file');
 //        // return res.end("File uploaded sucessfully!."); 
 //    }); 


	gameID = gameID + 1;
	//GAME
	var sql = 'INSERT INTO Game (gameID, gameTitle, defaultImage, clickName, achievementsTitle, storeName, clickOverride, overrideIcon, clickSFX) VALUES (\'' 
        + gameID + '\', \'' 
        + gameTitle + '\', \'' 
        + '\',\'' 
        + clickName + '\',\'' 
        + achievementsTitle + '\',\'' 
        + storeName + '\',\'' 
        + clickOverride + '\',\'' 
        + overrideIcon + '\',\''
        +  clickSFX + '\')';

    console.log(sql);

    var q = conn.query(sql);



    // ACHIEVEMENTS
    achievementID = achievementID + 1;
    var nameList = req.body['name'];
	var achievementImageList = req.body['achievementimage'];
	var clicksToUnlockList = req.body['clicksToUnlock'];
	var changesBigImageList = req.body['changesBigImage'];
	var newBigImageList = req.body['newBigImage'];
	var messageList = req.body['message'];

	var length = 0;
	if(typeof nameList === "string") {
		
		var name = nameList;

		var achievementimage = "";
    	if (typeof achievementImageList == 'undefined') {
			achievementimage = "";
		} else {
			achievementimage = achievementImageList;
		}

		var achievementimageURL = req.body['achievementimageURL'];
		if(achievementimageURL != "" && achievementimageURL != 'undefined') {
			achievementimage = achievementimageURL;
		}

    	
    	var clicksToUnlock = 0;
    	if (typeof clicksToUnlockList == 'undefined' | !clicksToUnlockList) {
			clicksToUnlock = 0;
		} else {
			clicksToUnlock = parseInt(clicksToUnlockList);
		}


    	var changesBigImage = "";
		if (typeof changesBigImageList == 'undefined') {
			changesBigImage = "";
		} else {
			changesBigImage = changesBigImageList;
		}



    	var newBigImage = "";
    	if (typeof newBigImageList == 'undefined') {
			newBigImage = "";
		} else {
			newBigImage = newBigImageList;
		}

		var newBigImageURL = req.body['newBigImageURL'];
		if(newBigImageURL != "" && newBigImage != 'undefined') {
			newBigImage = newBigImageURL;
		}

    	var message = messageList;


		sql = 'INSERT INTO Achievements (gameID, name, achievementimage, clicksToUnlock, changesBigImage, newBigImage, message, achievementID) VALUES (\'' 
         + gameID + '\', \'' 
         + name + '\', \'' 
         + achievementimage + '\', \'' 
         + clicksToUnlock + '\', \'' 
         + changesBigImage + '\', \'' 
         + newBigImage + '\', \'' 
         + message + '\', \'' 
         +  achievementID + '\')';

     	console.log(sql); 
     	q = conn.query(sql);


	} else {
		length = nameList.length;

		for(var count = 0; count < length; count++) {

    	var name = nameList[count];

		var achievementimage = "";
    	if (typeof achievementImageList == 'undefined') {
			achievementimage = "";
		} else {
			achievementimage = achievementImageList[count];
		}

		var achievementimageURL = req.body['achievementimageURL'][count];
		if(achievementimageURL != "" && achievementimageURL != 'undefined') {
			achievementimage = achievementimageURL;
		}
    	
    	var clicksToUnlock = 0;
    	if (typeof clicksToUnlockList == 'undefined') {
			clicksToUnlock = 0;
		} else {
			clicksToUnlock = parseInt(clicksToUnlockList[count]);
		}


    	var changesBigImage = 0;
		if (typeof changesBigImageList == 'undefined') {
			changesBigImage = 0;
		} else {
			changesBigImage = parseInt(changesBigImageList[count]);
		}

    	var newBigImage = "";
    	if (typeof newBigImageList == 'undefined') {
			newBigImage = "";
		} else {
			newBigImage = newBigImageList[count];
		}

		var newBigImageURL = req.body['newBigImageURL'][count];
		if(newBigImageURL != "" && newBigImage != 'undefined') {
			newBigImage = newBigImageURL;
		}

    	var message = messageList[count];

		sql = 'INSERT INTO Achievements (gameID, name, achievementimage, clicksToUnlock, changesBigImage, newBigImage, message, achievementID) VALUES (\'' 
         + gameID + '\', \'' 
         + name + '\', \'' 
         + achievementimage + '\', \'' 
         + clicksToUnlock + '\', \'' 
         + changesBigImage + '\', \'' 
         + newBigImage + '\', \'' 
         + message + '\', \''
         +  achievementID + '\')';

     	console.log(sql); 
     	q = conn.query(sql);

     	achievementID = achievementID + 1;
 	
 	}
	}
 

	// STORE

	itemID = itemID + 1;
 
 	var storeimageList = req.body['storeimage'];
 	var titleList = req.body['title'];
 	var costList = req.body['cost'];
 	var descriptionList = req.body['description'];
 	var costMultiplierList = req.body['costMultiplier'];
 	var passiveClicksList = req.body['passiveClicks'];
 	var passiveSecsList = req.body['passiveSecs'];
 	var manualClickMultiplierList = req.body['manualClickMultiplier'];
 	var autoClickList = req.body['autoClick'];
 	var manualClickList = req.body['manualClick'];

	var lengthStore = 0;
	if(typeof titleList === "string") {
		var storeimage = "";
     	if (typeof storeimageList == 'undefined') {
			storeimage = "";
		} else {
			storeimage = storeimageList;
		}

     	var title = titleList;
     	var cost = parseInt(costList);
     	var description = descriptionList;
     	
     	var costMultiplier = 0;
    	if (typeof costMultiplierList == 'undefined') {
			costMultiplier = 0;
		} else {
			costMultiplier = parseInt(costMultiplierList);
		}
     	
     	var passiveClicks = 0;
    	if (typeof passiveClicksList == 'undefined') {
			passiveClicks = 0;
		} else {
			passiveClicks = parseInt(passiveClicksList);
		}
     	
     	var passiveSecs = parseInt(passiveSecsList);
     	var manualClickMultiplier = parseInt(manualClickMultiplierList);
     	
     	var autoClick = 0;
    	if (typeof autoClickList == 'undefined') {
			autoClick = 0;
		} else {
			autoClick = parseInt(autoClickList);
		}

     	var manualClick = 0;
    	if (typeof manualClickList == 'undefined') {
			manualClick = 0;
		} else {
			manualClick = parseInt(manualClickList);
		}
 
     sql = 'INSERT INTO Store (gameID, storeimage, title, cost, description, costMultiplier, passiveClicks, passiveSecs, manualClickMultiplier,autoClick,itemID, manualClick) VALUES (\'' 
         + gameID + '\', \'' 
         + storeimage + '\', \'' 
         + title + '\', \''  
         + cost + '\', \''  
         + description + '\', \''  
         + costMultiplier + '\', \''  
         + passiveClicks + '\', \''  
         + passiveSecs + '\', \'' 
         + manualClickMultiplier + '\', \'' 
         + autoClick + '\', \'' 
         + itemID + '\', \'' 
         +  manualClick + '\')';
 
     	console.log(sql);
     	q = conn.query(sql);

	} else {
		lengthStore = titleList.length;

		for(var count = 0; count < lengthStore; count++) {
 
     	var storeimage = "";
     	if (typeof storeimageList == 'undefined') {
			storeimage = "";
		} else {
			storeimage = storeimageList[count];
		}

     	var title = titleList[count];
     	var cost = parseInt(costList[count]);
     	var description = descriptionList[count];

        var costMultiplier = 0;
    	if (typeof costMultiplierList == 'undefined') {
			costMultiplier = 0;
		} else {
			costMultiplier = parseInt(costMultiplierList[count]);
		}
     	
     	var passiveClicks = 0;
    	if (typeof passiveClicksList == 'undefined') {
			passiveClicks = 0;
		} else {
			passiveClicks = parseInt(passiveClicksList[count]);
		}
     	

     	var passiveSecs = parseInt(passiveSecsList[count]);
     	var manualClickMultiplier = parseInt(manualClickMultiplierList[count]);
     	
    	var autoClick = 0;
    	if (typeof autoClickList == 'undefined') {
			autoClick = 0;
		} else {
			autoClick = parseInt(autoClickList[count]);
		}

     	var manualClick = 0;
    	if (typeof manualClickList == 'undefined') {
			manualClick = 0;
		} else {
			manualClick = parseInt(manualClickList[count]);
		}
 
     sql = 'INSERT INTO Store (gameID, storeimage, title, cost, description, costMultiplier, passiveClicks, passiveSecs, manualClickMultiplier,autoClick,itemID, manualClick) VALUES (\'' 
         + gameID + '\', \'' 
         + storeimage + '\', \'' 
         + title + '\', \''  
         + cost + '\', \''  
         + description + '\', \''  
         + costMultiplier + '\', \''  
         + passiveClicks + '\', \''  
         + passiveSecs + '\', \'' 
         + manualClickMultiplier + '\', \'' 
         + itemID + '\', \'' 
         + autoClick + '\', \'' 
         +  manualClick + '\')';
 
     	q = conn.query(sql);
 		itemID = itemID + 1;
 	}
	}

	// SEND BACK TO FRONT END:
	sql = 'SELECT * FROM Game WHERE gameID = ' + gameID;
 	var ret = {};
 	conn.query(sql, function(err, res) {
        game = res.rows;
   
        ret['game'] = game;

        sql = 'SELECT * FROM Achievements WHERE gameID = ' + gameID;
	 	conn.query(sql, function(err, res) {
	        achievements = res.rows;
	        
	        ret['achievements'] = achievements;

	        sql = 'SELECT * FROM Store WHERE gameID = ' + gameID;
		 	conn.query(sql, function(err, res) {
		        store = res.rows;
		        ret['store'] = store;

		        console.log(ret);
		    	result.json(ret);
		    }); 
		    
	    }); 
    });
});


server.listen(8080, function(){
    console.log('- Server listening on port 8080');
});