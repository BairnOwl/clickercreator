var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://database.db');

var engine = require('consolidate');

app.engine('html', engine.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/views'); // tell Express where to find templates
app.use(express.static('public'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(express.static(__dirname + '/views'));
app.engine('html', engine.mustache);
app.set('view engine', 'html');

var gameID = 0;
var achievementID = 0;
var itemID = 0;

app.get('*', function(request, response) {
    response.render('index.html');
    var sql = 'SELECT count(gameID) FROM Game';
    gameID = conn.query(sql); 

    var sql = 'SELECT count(achievementID) FROM Achievements';
    achievementID = conn.query(sql); 

    var sql = 'SELECT count(itemID) FROM Store';
    itemID = conn.query(sql); 
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


app.post('/createGame', function(req, res) {

	// Game section

	console.log(req.body);
	
	var gameTitle = req.body['game']['gameTitle'];
	var defaultImage = req.body['game']['defaultImage'];
	var clickName = req.body['game']['clickName'];
	var achievementsTitle = req.body['game']['achievementsTitle'];
	var storeName = req.body['game']['storeName'];
	var clickOverride = parseInt(req.body['game']['clickOverride']);
	var overrideIcon = parseInt(req.body['game']['overrideIcon']);
	var clickSFX = req.body['game']['clickSFX'];

	// write sql query here

	gameID = gameID + 1;
	//GAME
	var sql = 'INSERT INTO Game (gameID, gameTitle, defaultImage, clickName, achievementsTitle, storeName, clickOverride, overrideIcon, clickSFX) VALUES (\'' 
        + gameID + '\', \'' 
        + gameTitle + '\', \'' 
        + defaultImage + '\', ' 
        + clickName + '\', ' 
        + achievementsTitle + '\', ' 
        + storeName + '\', ' 
        + clickOverride + '\', ' 
        + overrideIcon + '\', '
        +  clickSFX + ')';

    var q = conn.query(sql);

    // ACHIEVEMENTS
    
    var listAchievements = req.body['achievements'][0];
    achievementID = achievementID + 1;

    for(var achievement of listAchievements) {

    	var name = achievement['name'];
    	var achievementimage = achievement['achievementimage'];
    	var clicksToUnlock = achievement['clicksToUnlock'];
    	var changesBigImage = achievement['changesBigImage'];
    	var newBigImage = achievement['newBigImage'];
    	var message = achievement['message'];
    	var achievementID = achievement['achievementID'];

	    sql = 'INSERT INTO Achievements (gameID, name, achievementimage, clicksToUnlock, changesBigImage, newBigImage, message, achievementID) VALUES (\'' 
        + gameID + '\', \'' 
        + name + '\', \'' 
        + achievementimage + '\', ' 
        + clicksToUnlock + '\', ' 
        + changesBigImage + '\', ' 
        + newBigImage + '\', ' 
        + message + '\', ' 
        +  achievementID + ')';

    	q = conn.query(sql);
    	achievementID = achievementID + 1;
	
	}

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


	for(var count in templist) {

    	var storeimage = storeimageList[count];
    	var title = titleList[count];
    	var cost = costList[count];
    	var description = descriptionList[count];
    	var costMultiplier = costMultiplier[count];
    	var passiveClicks = passiveClicks[count];
    	var passiveSecs = passiveSecs[count];
    	var manualClickMultiplier = manualClickMultiplierList[count];
    	var autoClick = autoClickList[count];

    sql = 'INSERT INTO Store (gameID, storeimage, title, cost, description, costMultiplier, passiveClicks, passiveSecs, manualClickMultiplier,autoClick,itemID, manualClick) VALUES (\'' 
        + gameID + '\', \'' 
        + storeimage + '\', \'' 
        + title + '\', ' 
        + cost + '\', ' 
        + description + '\', ' 
        + costMultiplier + '\', ' 
        + passiveClicks + '\', ' 
        + passiveSecs + '\', '
        + manualClickMultiplier + '\', '
        + itemID + '\', '
        + autoClick + '\', '
        +  manualClick + ')';

    q = conn.query(sql);
	itemID = itemID + 1;
	}
    
    //response.render('room.html', {roomName: request.params.roomName, nickname: nickname});
});


server.listen(8080, function(){
    console.log('- Server listening on port 8080');
});