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

app.get('*', function(request, response) {
    response.render('index.html');
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
		achievements: {
			achievementList: [
				{
					name: "",
					image: "",
					clicksToUnlock: int,
					changesBigImage: int,
					newBigImage: "",
					message: ""
				}
			]

		},
		store: {
			storeList: [
				{
					title: "",
					image: "",
					cost: int,
					description: ""
					costMultiplier: int,
					passiveClicks: int,
					passiveSecs: int,
					manualClickMultiplier: int,
					passiveClickMultiplier: int,
				}
			]
		}
	}
*/


app.post('/', function(req, res) {

	// Game section
	var gameTitle = req.body['game']['gameTitle'];
	var defaultImage = req.body['game']['defaultImage'];
	var clickName = req.body['game']['clickName'];
	var achievementsTitle = req.body['game']['achievementsTitle'];
	var storeName = req.body['game']['storeName'];
	var clickOverride = req.body['game']['clickOverride'];
	var overrideIcon = req.body['game']['overrideIcon'];
	var clickSFX = req.body['game']['clickSFX'];

	// write sql query here

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
    // for each achievement...

    var sql = 'INSERT INTO Achievements (gameID, name, image, clicksToUnlock, changesBigImage, newBigImage, message, achievementID) VALUES (\'' 
        + gameID + '\', \'' 
        + name + '\', \'' 
        + image + '\', ' 
        + clicksToUnlock + '\', ' 
        + changesBigImage + '\', ' 
        + newBigImage + '\', ' 
        + message + '\', ' 
        +  achievementID + ')';

    var q = conn.query(sql);

    	var sql = 'INSERT INTO Store (gameID, image, title, cost, description, costMultiplier, passiveClicks, passiveSecs, manualClickMultiplier,passiveClickMultiplier,itemID) VALUES (\'' 
        + gameID + '\', \'' 
        + image + '\', \'' 
        + title + '\', ' 
        + cost + '\', ' 
        + description + '\', ' 
        + costMultiplier + '\', ' 
        + passiveClicks + '\', ' 
        + passiveSecs + '\', '
        + manualClickMultiplier + '\', '
        + passiveClickMultiplier + '\', '
        +  itemID + ')';

    var q = conn.query(sql);

    //response.render('room.html', {roomName: request.params.roomName, nickname: nickname});
});


server.listen(8080, function(){
    console.log('- Server listening on port 8080');
});