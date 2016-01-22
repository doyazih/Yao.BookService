
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var config = process.env.NODE_ENV == 'developer' ? require('./configs/config_developer.json') : require('./configs/config.json')
		global.config = config;

var homeController = require('./controllers/homeController.js')
var bookController = require('./controllers/bookController.js')
var viewerController = require('./controllers/viewerController.js')
		
var app = express();

// all environments
app.set('port', global.config.WEB_PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//View
app.get('/', homeController.Index);
app.get('/viewer', viewerController.Index);

//Api
app.get('/api/book/categories', bookController.GetCategories);
app.get('/api/book/categories/:Category', bookController.GetCategory);

//app.get('/api/book/titles', bookController.GetTitles);
//app.get('/api/book/titles/:Title', bookContoller.GetTitle)


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
