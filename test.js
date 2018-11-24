// Dependencies
var express = require('express');
var bodyParser = require('body-parser');

// Express
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/', require('./routes/api'));

app.get('/', function(req, res) {
	res.send('Welcome!');
});

app.get('/test', function(req, res) {
	res.send({
		'Name':"Nick",
		'ID': 1897,
		'Age':21,
		'Address':"296/16A, FBD",
	});
});

app.listen(4000, ()=>{
	console.log('API is running on PORT : 4000');
});