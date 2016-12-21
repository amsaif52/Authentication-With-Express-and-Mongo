var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	favicon = require('serve-favicon');

mongoose.connect("mongodb://localhost:27017/bookworm");
var db = mongoose.connection;

db.on('error', console.error.bind('console',"connection error"));

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine','pug');
app.set('views', __dirname+'/views');

app.use('/static', express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

var routes = require('./routes/index');
app.use('/',routes);

app.use(function(req,res,next){
	var err = new Error("Not Found");
	err.status = 400;
	next(err);
});

app.use(function(err,req,res,next){
	res.status(err.status || 500);
	res.render('error',{message: err.message, error:{}, title: 'Error'});
	next();
});

app.listen(port,function(){
	console.log(`Listening to Port: ${port}`);
})

