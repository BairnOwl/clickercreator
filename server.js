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
    var sql = 'SELECT count(gameID) as numGames FROM Game';
    gameID = conn.query(sql, function(err, res) {
        gameID = res.rows[0]['numGames'];
    });; 

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
					image: "",
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
					image: "",
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
	var clickOverride = req.body['game']['clickOverride'];
	var overrideIcon = req.body['game']['overrideIcon'];
	var clickSFX = req.body['game']['clickSFX'];

	if (typeof clickOverride == 'undefined') {
		clickOverride = 0;
	} else {
		clickOverride = parseInt(clickOverride);
	}

	if (typeof overrideIcon == 'undefined') {
		overrideIcon = 0;
	} else {
		overrideIcon = parseInt(overrideIcon);
	}

	console.log(gameTitle);
	console.log(defaultImage);
	console.log(clickName);
	console.log(achievementsTitle);
	console.log(storeName);
	console.log(clickOverride);
	console.log(overrideIcon);
	console.log(clickSFX);


	gameID = gameID + 1;
	//GAME
	var sql = 'INSERT INTO Game (gameID, gameTitle, defaultImage, clickName, achievementsTitle, storeName, clickOverride, overrideIcon, clickSFX) VALUES (\'' 
        + gameID + '\', \'' 
        + gameTitle + '\', \'' 
        + defaultImage + '\',\'' 
        + clickName + '\',\'' 
        + achievementsTitle + '\',\'' 
        + storeName + '\',\'' 
        + clickOverride + '\',\'' 
        + overrideIcon + '\',\''
        +  clickSFX + '\')';

    console.log(sql);

    var q = conn.query(sql);



    // ACHIEVEMENTS
    
 //    var listAchievements = req.body['achievements'][0];
 //    achievementID = achievementID + 1;

 //    for(var achievement of listAchievements) {

 //    	var name = achievement['name'];
 //    	var image = achievement['image'];
 //    	var clicksToUnlock = achievement['clicksToUnlock'];
 //    	var changesBigImage = achievement['changesBigImage'];
 //    	var newBigImage = achievement['newBigImage'];
 //    	var message = achievement['message'];
 //    	var achievementID = achievement['achievementID'];

	//     sql = 'INSERT INTO Achievements (gameID, name, image, clicksToUnlock, changesBigImage, newBigImage, message, achievementID) VALUES (\'' 
 //        + gameID + '\', \'' 
 //        + name + '\', \'' 
 //        + image + '\', ' 
 //        + clicksToUnlock + '\', ' 
 //        + changesBigImage + '\', ' 
 //        + newBigImage + '\', ' 
 //        + message + '\', ' 
 //        +  achievementID + ')';

 //    	q = conn.query(sql);
 //    	achievementID = achievementID + 1;
	
	// }

	// var listItems = req.body['store'];
	// itemID = itemID + 1;

	// for(var item of listItems) {

 //    	var image = item['image'];
 //    	var title = item['title'];
 //    	var cost = item['cost'];
 //    	var description = item['description'];
 //    	var costMultiplier = item['costMultiplier'];
 //    	var passiveClicks = item['passiveClicks'];
 //    	var passiveSecs = item['passiveSecs'];
 //    	var manualClickMultiplier = item['manualClickMultiplier'];
 //    	var autoClick = item['autoClick'];

 //    sql = 'INSERT INTO Store (gameID, image, title, cost, description, costMultiplier, passiveClicks, passiveSecs, manualClickMultiplier,autoClick,itemID, manualClick) VALUES (\'' 
 //        + gameID + '\', \'' 
 //        + image + '\', \'' 
 //        + title + '\', ' 
 //        + cost + '\', ' 
 //        + description + '\', ' 
 //        + costMultiplier + '\', ' 
 //        + passiveClicks + '\', ' 
 //        + passiveSecs + '\', '
 //        + manualClickMultiplier + '\', '
 //        + itemID + '\', '
 //        + autoClick + '\', '
 //        +  manualClick + ')';

    // q = conn.query(sql);
	itemID = itemID + 1;
	
    
    //response.render('room.html', {roomName: request.params.roomName, nickname: nickname});
});


server.listen(8080, function(){
    console.log('- Server listening on port 8080');
});