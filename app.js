var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');
var api = require('./routes/api');

mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.get('/', function(req, res) {
  res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/setup', function(req, res) {
  var admin = new User({
    name: 'John Doe',
    password: 'pass',
    admin: true
  });

  admin.save(function(err) {
    if (err) throw err;

    console.log("User saved successfully");
    res.json({success: true});

  });
});

app.use('/api', api(jwt, User));

module.exports = app;

