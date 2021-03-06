
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var config = process.env.NODE_ENV == 'development' ? require('./configs/config_development.json') : require('./configs/config.json')
		global.config = config;

var route = require('./routes/route.js')
var homeController = require('./controllers/homeController.js')
var bookController = require('./controllers/bookController.js')
var bookApiController = require('./controllers/bookApiController.js')
		
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
app.get('/index', homeController.Index);
app.get('/bookcase', bookController.Introduction);
app.get('/bookcase/index', bookController.Introduction);
app.get('/bookcase/collections', bookController.Index);
app.get('/bookcase/introduction', bookController.Introduction);


//Api
app.get('/api/book/categories', bookApiController.GetCategories);
app.get('/api/book/categories/:Category/titles', bookApiController.GetTitles);
app.get('/api/book/categories/:Category/titles/:Title/volumes', bookApiController.GetVolumes);
app.get('/api/book/categories/:Category/titles/:Title/volumes/:Volume/pages', bookApiController.GetPages);
app.get('/api/book/categories/:Category/titles/:Title/volumes/:Volume/pages/:Page', bookApiController.GetPage);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
