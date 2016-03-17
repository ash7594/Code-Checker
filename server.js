var express = require('express'),
	app = express();
var path = require('path');
var cookieParser = require('cookie-parser'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	fs = require('fs');
var executer = require('./execution/process');

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8000);

const SESSION_SECRET = 'CodeCHEcKer_YeS';

app.use(cookieParser());
app.use(session({
    secret: SESSION_SECRET,
    key: 'connect.ash',
    saveUninitialized: true,
    resave: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));

function homePage(req, res) {
	var lang, code, customTest;
	function fcodeRead(err, data) {
		if (err) {
			throw err;
		}
		code = data;
		fs.readFile('./test/testcase', {encoding: 'utf8'}, ftestRead);
	}
	function ftestRead(err, data) {
		if (err) {
			throw err;
		}
		customTest = data;
		new executer.spawn(lang, code, customTest, finishedExec);
	}
	function finishedExec(data) {
		res.send(data);
	}
	fs.readFile('./test/code.cpp', {encoding: 'utf8'}, fcodeRead);
}

app.get('/', homePage);

function startServer() {
	app.listen(app.get('port'));
	console.log('Serving on PORT ' + app.get('port'));
}

startServer();
